// source taken from https://github.com/rackt/redux/blob/master/src/utils/pick.js

export default function pick(obj, fn) {
  return Object.keys(obj).reduce((result, key) => {
    if (fn(obj[key])) {
      result[key] = obj[key]; // eslint-disable-line
    }
    return result;
  }, {});
}
