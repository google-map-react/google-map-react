export default function raf(callback) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }

  const nativeRaf =
    window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

  return nativeRaf
    ? nativeRaf(callback)
    : window.setTimeout(callback, 1e3 / 60);
}
