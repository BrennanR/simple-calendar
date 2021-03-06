/* eslint-disable */

// This is all stack overflow internet code. Don't bother linting it.

export function rgbToHex(color) {
  color = `${color}`;
  if (!color || color.indexOf('rgb') < 0) {
    return;
  }

  if (color.charAt(0) == '#') {
    return color;
  }

  const nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
    r = parseInt(nums[2], 10).toString(16),
    g = parseInt(nums[3], 10).toString(16),
    b = parseInt(nums[4], 10).toString(16);

  return `#${(r.length == 1 ? `0${r}` : r) + (g.length == 1 ? `0${g}` : g) + (b.length == 1 ? `0${b}` : b)}`;
}

export const randomColor = () => {
  const rgb = [];
  for (let i = 0; i < 3; i++) {
    rgb.push(Math.floor(Math.random() * 255));
  }
  return `rgb(${rgb.join(',')})`;
};

function padZero(str, len) {
  len = len || 2;
  const zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

export function invertColor(hex, bw) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  let r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
}
