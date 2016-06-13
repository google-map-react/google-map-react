// https://github.com/acdlite/recompose/blob/master/src/packages/recompose/utils/pick.js

const pick = (obj, keys) => {
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }
  return result;
};

export default pick;
