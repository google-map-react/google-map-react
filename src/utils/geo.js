import LatLng from './lib_geo/lat_lng.js';
import Point from 'point-geometry';
import Transform from './lib_geo/transform.js';


export default class Geo {

  constructor(tileSize) { // left_top view пользует гугл
    // super();
    this.hasSize_ = false;
    this.hasView_ = false;
    this.transform_ = new Transform(tileSize || 512);
  }

  setView(center, zoom, bearing) {
    this.transform_.center = LatLng.convert(center);
    this.transform_.zoom = +zoom;
    this.transform_.bearing = +bearing;
    this.hasView_ = true;
  }

  setViewSize(width, height) {
    this.transform_.width = width;
    this.transform_.height = height;
    this.hasSize_ = true;
  }

  canProject() {
    return this.hasSize_ && this.hasView_;
  }

  hasSize() {
    return this.hasSize_;
  }

  unproject(ptXY, viewFromLeftTop) {
    let ptRes;
    if (viewFromLeftTop) {
      const ptxy = { ...ptXY };
      ptxy.x -= this.transform_.width / 2;
      ptxy.y -= this.transform_.height / 2;
      ptRes = this.transform_.pointLocation(Point.convert(ptxy));
    } else {
      ptRes = this.transform_.pointLocation(Point.convert(ptXY));
    }

    ptRes.lng -= 360 * Math.round(ptRes.lng / 360); // convert 2 google format
    return ptRes;
  }

  project(ptLatLng, viewFromLeftTop) {
    if (viewFromLeftTop) {
      const pt = this.transform_.locationPoint(LatLng.convert(ptLatLng));
      pt.x -= this.transform_.worldSize * Math.round(pt.x / this.transform_.worldSize);

      pt.x += this.transform_.width / 2;
      pt.y += this.transform_.height / 2;

      return pt;
    }

    return this.transform_.locationPoint(LatLng.convert(ptLatLng));
  }

  getWidth() {
    return this.transform_.width;
  }

  getHeight() {
    return this.transform_.height;
  }

  getZoom() {
    return this.transform_.zoom;
  }

  getCenter() {
    const ptRes = this.transform_.pointLocation({ x: 0, y: 0 });

    return ptRes;
  }

  getBounds(margins, roundFactor) {
    const bndT = margins && margins[0] || 0;
    const bndR = margins && margins[1] || 0;
    const bndB = margins && margins[2] || 0;
    const bndL = margins && margins[3] || 0;

    if (this.getWidth() - bndR - bndL > 0 && this.getHeight() - bndT - bndB > 0) {
      const topLeftCorner = this.unproject({
        x: bndL - this.getWidth() / 2,
        y: bndT - this.getHeight() / 2,
      });
      const bottomRightCorner = this.unproject({
        x: this.getWidth() / 2 - bndR,
        y: this.getHeight() / 2 - bndB,
      });

      let res = [
        topLeftCorner.lat, topLeftCorner.lng,
        bottomRightCorner.lat, bottomRightCorner.lng,
      ];

      if (roundFactor) {
        res = res.map(r => Math.round(r * roundFactor) / roundFactor);
      }
      return res;
    }

    return [0, 0, 0, 0];
  }
}
