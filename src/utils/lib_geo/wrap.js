'use strict';

exports.wrap = function (n, min, max) {
    var d = max - min;
    return n === max ? n : ((n - min) % d + d) % d + min;
};
