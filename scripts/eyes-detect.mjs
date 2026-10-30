// Localiza cada iris en ../profile.png: centro y radio a partir de los píxeles de iris (ni esclera ni piel).
import sharp from 'sharp';
const { data, info } = await sharp('../profile.png').removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const px = (x, y) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
const isIris = ([r, g, b]) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 510, s = mx ? (mx - mn) / mx : 0;
  const sclera = l > 0.62 && s < 0.22;
  const skin = r > g + 22 && r > b + 30;
  return !sclera && !skin && l < 0.62;
};
for (const [name, gx, gy] of [['izq', 459, 725], ['der', 657, 723]]) {
  let n = 0, sx = 0, sy = 0;
  for (let y = gy - 26; y <= gy + 26; y++) for (let x = gx - 26; x <= gx + 26; x++) {
    if ((x - gx) ** 2 + (y - gy) ** 2 > 26 ** 2) continue;
    if (isIris(px(x, y))) { n++; sx += x; sy += y; }
  }
  const cx = sx / n, cy = sy / n;
  // Radio: extensión horizontal del iris en la fila del centro.
  const row = Math.round(cy); let L = Math.round(cx), R = Math.round(cx);
  while (isIris(px(L - 1, row)) || isIris(px(L - 2, row))) L--;
  while (isIris(px(R + 1, row)) || isIris(px(R + 2, row))) R++;
  console.log(name, { cx: +cx.toFixed(1), cy: +cy.toFixed(1), r: (R - L) / 2, L, R, n });
}
