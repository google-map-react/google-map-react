
const LatLng = require('./lat_lng');
const Point = require('point-geometry');
const wrap = require('./wrap.js').wrap;


// A single transform, generally used for a single tile to be scaled, rotated, and zoomed.

function Transform(tileSize, minZoom, maxZoom) {
  this.tileSize = tileSize || 512; // constant

  this._minZoom = minZoom || 0;
  this._maxZoom = maxZoom || 52;

  this.latRange = [-85.05113, 85.05113];

  this.width = 0;
  this.height = 0;
  this.zoom = 0;
  this.center = new LatLng(0, 0);
  this.angle = 0;
}

Transform.prototype = {
  get minZoom() { return this._minZoom; },
  set minZoom(zoom) {
    this._minZoom = zoom;
    this.zoom = Math.max(this.zoom, zoom);
  },

  get maxZoom() { return this._maxZoom; },
  set maxZoom(zoom) {
    this._maxZoom = zoom;
    this.zoom = Math.min(this.zoom, zoom);
  },

  get worldSize() {
    return this.tileSize * this.scale;
  },

  get centerPoint() {
    return new Point(0, 0); // this.size._div(2);
  },

  get size() {
    return new Point(this.width, this.height);
  },

  get bearing() {
    return -this.angle / Math.PI * 180;
  },
  set bearing(bearing) {
    this.angle = -wrap(bearing, -180, 180) * Math.PI / 180;
  },

  get zoom() { return this._zoom; },
  set zoom(zoom) {
    zoom = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
    this._zoom = zoom;
    this.scale = this.zoomScale(zoom);
    this.tileZoom = Math.floor(zoom);
    this.zoomFraction = zoom - this.tileZoom;
  },

  zoomScale: function(zoom) { return Math.pow(2, zoom); },
  scaleZoom: function(scale) { return Math.log(scale) / Math.LN2; },

  project: function(latlng, worldSize) {
    return new Point(
      this.lngX(latlng.lng, worldSize),
      this.latY(latlng.lat, worldSize));
  },

  unproject: function(point, worldSize) {
    return new LatLng(
      this.yLat(point.y, worldSize),
      this.xLng(point.x, worldSize));
  },

  get x() {
    return this.lngX(this.center.lng);
  },
  get y() {
    return this.latY(this.center.lat);
  },

  get point() { return new Point(this.x, this.y); },

  // lat/lon <-> absolute pixel coords convertion
  lngX: function(lon, worldSize) {
    return (180 + lon) * (worldSize || this.worldSize) / 360;
  },
  // latitude to absolute y coord
  latY: function(lat, worldSize) {
    var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
    return (180 - y) * (worldSize || this.worldSize) / 360;
  },

  xLng: function(x, worldSize) {
    return x * 360 / (worldSize || this.worldSize) - 180;
  },
  yLat: function(y, worldSize) {
    var y2 = 180 - y * 360 / (worldSize || this.worldSize);
    return 360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90;
  },


  locationPoint: function(latlng) {
    var p = this.project(latlng);
    return this.centerPoint._sub(this.point._sub(p)._rotate(this.angle));
  },

  pointLocation: function(p) {
    var p2 = this.centerPoint._sub(p)._rotate(-this.angle);
    return this.unproject(this.point.sub(p2));
  },


};

module.exports = Transform;
