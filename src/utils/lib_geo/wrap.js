/* eslint-disable import/prefer-default-export */

export function wrap(n, min, max) {
  const d = max - min;
  return n === max ? n : ((((n - min) % d) + d) % d) + min;
}
