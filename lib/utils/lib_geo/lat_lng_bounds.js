'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lat_lng = require('./lat_lng');

var _lat_lng2 = _interopRequireDefault(_lat_lng);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LatLngBounds = function () {
  function LatLngBounds(sw, ne) {
    var _this = this;

    _classCallCheck(this, LatLngBounds);

    this.getCenter = function () {
      return new _lat_lng2.default((_this._sw.lat + _this._ne.lat) / 2, (_this._sw.lng + _this._ne.lng) / 2);
    };

    this.getSouthWest = function () {
      return _this._sw;
    };

    this.getNorthEast = function () {
      return _this._ne;
    };

    this.getNorthWest = function () {
      return new _lat_lng2.default(_this.getNorth(), _this.getWest());
    };

    this.getSouthEast = function () {
      return new _lat_lng2.default(_this.getSouth(), _this.getEast());
    };

    this.getWest = function () {
      return _this._sw.lng;
    };

    this.getSouth = function () {
      return _this._sw.lat;
    };

    this.getEast = function () {
      return _this._ne.lng;
    };

    this.getNorth = function () {
      return _this._ne.lat;
    };

    if (!sw) return;

    var latlngs = ne ? [sw, ne] : sw;

    for (var i = 0, len = latlngs.length; i < len; i++) {
      this.extend(latlngs[i]);
    }
  }

  _createClass(LatLngBounds, [{
    key: 'extend',
    value: function extend(obj) {
      var sw = this._sw;
      var ne = this._ne;
      var sw2 = void 0;
      var ne2 = void 0;

      if (obj instanceof _lat_lng2.default) {
        sw2 = obj;
        ne2 = obj;
      } else if (obj instanceof LatLngBounds) {
        sw2 = obj._sw;
        ne2 = obj._ne;

        if (!sw2 || !ne2) return this;
      } else {
        return obj ? this.extend(_lat_lng2.default.convert(obj) || LatLngBounds.convert(obj)) : this;
      }

      if (!sw && !ne) {
        this._sw = new _lat_lng2.default(sw2.lat, sw2.lng);
        this._ne = new _lat_lng2.default(ne2.lat, ne2.lng);
      } else {
        sw.lat = Math.min(sw2.lat, sw.lat);
        sw.lng = Math.min(sw2.lng, sw.lng);
        ne.lat = Math.max(ne2.lat, ne.lat);
        ne.lng = Math.max(ne2.lng, ne.lng);
      }

      return this;
    }
  }]);

  return LatLngBounds;
}();

LatLngBounds.convert = function (a) {
  if (!a || a instanceof LatLngBounds) return a;
  return new LatLngBounds(a);
};

exports.default = LatLngBounds;