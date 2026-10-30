// Builds a silhouette matte of the grey-background portrait (profile.png) by keying the neutral backdrop.
import sharp from 'sharp';
const src = process.argv[2], out = process.argv[3];
const img = sharp(src);
const { width: W, height: H } = await img.metadata();
const { data } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
// Sample backdrop colour per row from the left/right 40px columns (handles the vertical gradient).
const bgRow = new Float32Array(H * 3);
for (let y = 0; y < H; y++) { const sy = Math.min(y, 1000);
  let r = 0, g = 0, b = 0, n = 0;
  for (const x0 of [0, W - 40]) for (let x = x0; x < x0 + 40; x++) { const i = (sy * W + x) * 3; r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
  bgRow[y * 3] = r / n; bgRow[y * 3 + 1] = g / n; bgRow[y * 3 + 2] = b / n;
}
const a = new Float32Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 3;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b, chroma = Math.max(r, g, b) - Math.min(r, g, b);
  // Backdrop is neutral light grey: low chroma and bright. Distance from that class gives the alpha.
  const dl = Math.max(0, 128 - lum) / 26, dc = Math.max(0, chroma - 10) / 10;
  a[y * W + x] = Math.min(1, Math.max(dl, dc));
}
// Keep only what is connected to the bottom edge (the subject), fill enclosed holes.
const solid = new Uint8Array(W * H); for (let k = 0; k < W * H; k++) solid[k] = a[k] > 0.5 ? 1 : 0;
const keep = new Uint8Array(W * H); const st = [];
for (let x = 0; x < W; x++) { const k = (H - 1) * W + x; if (solid[k]) { keep[k] = 1; st.push(k); } }
while (st.length) { const k = st.pop(); const x = k % W, y = (k / W) | 0;
  for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) { if (nx<0||ny<0||nx>=W||ny>=H) continue; const q = ny*W+nx; if (solid[q] && !keep[q]) { keep[q]=1; st.push(q);} } }
const outside = new Uint8Array(W * H);
for (let x = 0; x < W; x++) for (const y of [0]) { const k = y*W+x; if (!keep[k]) { outside[k]=1; st.push(k);} }
for (let y = 0; y < H; y++) for (const x of [0, W-1]) { const k = y*W+x; if (!keep[k] && !outside[k]) { outside[k]=1; st.push(k);} }
while (st.length) { const k = st.pop(); const x = k % W, y = (k / W) | 0;
  for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) { if (nx<0||ny<0||nx>=W||ny>=H) continue; const q = ny*W+nx; if (!keep[q] && !outside[q]) { outside[q]=1; st.push(q);} } }
const m = Buffer.alloc(W * H);
for (let k = 0; k < W * H; k++) m[k] = outside[k] ? Math.round(Math.min(a[k], 0.35) * 0) : (keep[k] ? 255 : Math.round(Math.max(a[k], 0.9) * 255));
// Soft edge: slight blur on the matte.
await sharp(m, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).png().toFile(out);
console.log('matte', W, H, out);
