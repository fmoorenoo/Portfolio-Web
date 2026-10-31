// Campo de presión de la carta: un único plano WebGL2 que pinta bandas de isobaras escalonadas y sus líneas.
// Los centros de presión se mueven despacio con el tiempo y se desplazan con el scroll («el frente pasa»).

export interface Centre { x: number; y: number; hpa: number; r: number }
export interface FieldOptions {
  palette: string[]; // 5 tonos, de baja a alta presión
  line: [number, number, number, number]; // color y opacidad de las isobaras
  maxDpr?: number; // resolución máxima del lienzo (por defecto 1.5, o 1.25 en pantallas estrechas)
  bands?: boolean; // false: sin bandas, un degradado vertical de palette[0] (arriba) a palette[4] (abajo) bajo las isobaras
  centres: Centre[]; // x, y en fracciones del lienzo (y hacia abajo)
}

const VERT = `#version 300 es
in vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec4 uC[6];
uniform vec3 uPal[5];
uniform vec4 uLine;
uniform float uBands;
out vec4 o;
float field(vec2 q) {
  float v = 1013.0;
  for (int i = 0; i < 6; i++) {
    vec2 d = q - uC[i].xy;
    v += uC[i].z * exp(-dot(d, d) / (uC[i].w * uC[i].w));
  }
  return v;
}
vec3 pal(float t) {
  t = clamp(t, 0.0, 1.0) * 4.0;
  vec3 c = mix(uPal[0], uPal[1], clamp(t, 0.0, 1.0));
  c = mix(c, uPal[2], clamp(t - 1.0, 0.0, 1.0));
  c = mix(c, uPal[3], clamp(t - 2.0, 0.0, 1.0));
  return mix(c, uPal[4], clamp(t - 3.0, 0.0, 1.0));
}
void main() {
  float a = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 q = vec2(uv.x * a, 1.0 - uv.y);
  float v = field(q);
  // Bandas de color cada 4 hPa; isobaras cada 2 hPa, con la maestra cada 8.
  float band = floor(v / 4.0);
  vec3 col = mix(mix(uPal[4], uPal[0], smoothstep(0.1, 1.0, uv.y)), pal((band * 4.0 - 996.0) / 32.0), uBands);
  float lv = v / 2.0;
  float f = fract(lv);
  float w = fwidth(lv);
  float d = min(f, 1.0 - f);
  float ln = 1.0 - smoothstep(0.0, w * 1.4, d - w * 0.2);
  float major = 1.0 - step(0.5, mod(floor(lv + 0.5), 4.0));
  ln *= mix(0.55, 1.0, major);
  o = vec4(mix(col, uLine.rgb, ln * uLine.a), 1.0);
}`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export class Field {
  private gl: WebGL2RenderingContext;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private visible = false;
  private frozen = false;
  private raf = 0;
  private t0 = performance.now();
  private cssW = 0;
  private cssH = 0;
  private ready = false;
  private lastShift = -1;
  private tick = 0;
  private centresData = new Float32Array(24);
  /** Desplazamiento del frente (0..1), lo fija el scroll. */
  shift = 0;
  /** Posiciones actuales de los centros, en fracciones del lienzo, por si algo tiene que seguirlos. */
  readonly now: Centre[];
  onFrame?: (centres: Centre[], w: number, h: number) => void;

  static create(canvas: HTMLCanvasElement, opts: FieldOptions): Field | null {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return null;
    try { return new Field(canvas, gl, opts); } catch { return null; }
  }

  private constructor(private canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, private opts: FieldOptions) {
    this.gl = gl;
    this.now = opts.centres.map((c) => ({ ...c }));
    const prog = gl.createProgram()!;
    for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      gl.attachShader(prog, s);
    }
    gl.linkProgram(prog);
    // Compilación síncrona a propósito: con KHR_parallel_shader_compile, en ANGLE/D3D11 el sondeo acababa bloqueando
    // unos 300 ms en mitad de la entrada; así bloquea ~40 ms antes de que empiece. Solo se consulta el enlace.
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    this.setup(prog);
  }

  private setup(prog: WebGLProgram) {
    const { gl, canvas, opts } = this;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['uRes', 'uC', 'uPal', 'uLine', 'uBands']) this.u[n] = gl.getUniformLocation(prog, n);
    gl.uniform1f(this.u.uBands, opts.bands === false ? 0 : 1);
    gl.uniform3fv(this.u.uPal, new Float32Array(opts.palette.flatMap(hex)));
    gl.uniform4fv(this.u.uLine, new Float32Array(opts.line));

    new ResizeObserver(() => this.resize()).observe(canvas);
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.loop();
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => this.loop());
    this.ready = true;
    this.resize();
    canvas.classList.add('is-on');
  }

  private resize() {
    const dpr = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.25 : this.opts.maxDpr ?? 1.5);
    this.cssW = this.canvas.clientWidth;
    this.cssH = this.canvas.clientHeight;
    const w = Math.round(this.cssW * dpr), h = Math.round(this.cssH * dpr);
    if (!w || !h) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
    this.gl.uniform2f(this.u.uRes, w, h);
    this.draw();
  }

  private step() {
    const t = (performance.now() - this.t0) / 1000;
    const s = this.shift;
    this.opts.centres.forEach((c, i) => {
      const k = i * 1.7;
      // Deriva lenta (alisio del nordeste) más el paso del frente con el scroll.
      this.now[i].x = c.x + Math.sin(t * 0.07 + k) * 0.035 - s * (0.22 + i * 0.03);
      this.now[i].y = c.y + Math.cos(t * 0.06 + k) * 0.03 + s * (0.1 - i * 0.02);
      this.now[i].hpa = c.hpa * (1 + Math.sin(t * 0.11 + k) * 0.06);
    });
  }

  draw() {
    if (!this.ready) return;
    const { gl, canvas } = this;
    const a = canvas.width / canvas.height;
    const data = this.centresData; // reutilizado: sin basura por frame
    this.now.forEach((c, i) => data.set([c.x * a, c.y, c.hpa, c.r], i * 4));
    gl.uniform4fv(this.u.uC, data);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.onFrame?.(this.now, this.cssW, this.cssH);
  }

  private loop = () => {
    cancelAnimationFrame(this.raf);
    if (!this.visible || this.frozen || document.hidden) return;
    // Mientras el frente pasa (scroll), a todos los frames; si solo deriva, que es lentísimo, a uno de cada dos.
    if (this.shift !== this.lastShift || ++this.tick % 2 === 0) {
      this.lastShift = this.shift;
      this.step();
      this.draw();
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  /** Pinta un único fotograma estático (sin movimiento). */
  still() {
    this.frozen = true;
    cancelAnimationFrame(this.raf);
    this.draw();
  }
}
