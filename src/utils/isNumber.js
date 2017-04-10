function isObjectLike(value) {
  return !!value && typeof value === 'object';
}

const objectToString = Object.prototype.toString;

export default function isNumber(value) {
  const numberTag = '[object Number]';
  return typeof value === 'number' ||
    (isObjectLike(value) && objectToString.call(value) === numberTag);
}
