const isEmpty = val => {
  // check for empty object {}, array []
  if (val !== null && typeof val === 'object') {
    if (Object.keys(val).length === 0) {
      return true;
    }
  } else if (val === null || val === undefined || val === '') {
    // check for undefined, null and ""
    return true;
  }
  return false;
};

export default isEmpty;
