function HueToRGB(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export const SaturatedColor = (color: string, percent: number) => {
  percent = Math.min(100, Math.max(-100, percent));

  const num = parseInt(color.replace('#', ''), 16);
  let R = num >> 16;
  let G = (num >> 8) & 0x00ff;
  let B = num & 0x0000ff;

  const r = R / 255;
  const g = G / 255;
  const b = B / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let l = (max + min) / 2;

  let h: number | undefined, s: number;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    if (h) h /= 6;
  }

  if (h === undefined) {
    throw new Error('Failed to calculate hue.');
  }

  l = Math.max(0, Math.min(1, l - percent / 100));

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  R = Math.round(HueToRGB(p, q, h + 1 / 3) * 255);
  G = Math.round(HueToRGB(p, q, h) * 255);
  B = Math.round(HueToRGB(p, q, h - 1 / 3) * 255);

  const resultColor =
    '#' + ((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1);

  return resultColor;
};

export const LightenDarkenColor = (color: string, percent: number) => {
  let num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

	let newColor : string = (
		0x1000000 +
		(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
		(B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
		(G < 255 ? (G < 1 ? 0 : G) : 255)
	  )
		.toString(16)
		.slice(1);
  return "#" + newColor;
};
