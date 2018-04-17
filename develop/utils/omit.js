// https://github.com/acdlite/recompose/blob/master/src/packages/recompose/utils/omit.js
const omit = (obj, keys) => {
  const { ...rest } = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key in rest) {
      delete rest[key];
    }
  }
  return rest;
};

export default omit;
