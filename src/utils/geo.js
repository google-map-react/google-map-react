import Point from '@mapbox/point-geometry';
import LatLng from './lib_geo/lat_lng';
import Transform from './lib_geo/transform';

export default class Geo {
  constructor(tileSize) {
    // left_top view пользует гугл
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

  setMapCanvasProjection(maps, mapCanvasProjection) {
    this.maps_ = maps;
    this.mapCanvasProjection_ = mapCanvasProjection;
  }

  canProject() {
    return this.hasSize_ && this.hasView_;
  }

  hasSize() {
    return this.hasSize_;
  }

  /** Returns the pixel position relative to the map center. */
  fromLatLngToCenterPixel(ptLatLng) {
    return this.transform_.locationPoint(LatLng.convert(ptLatLng));
  }

  /**
   * Returns the pixel position relative to the map panes,
   * or relative to the map center if there are no panes.
   */
  fromLatLngToDivPixel(ptLatLng) {
    if (this.mapCanvasProjection_) {
      const latLng = new this.maps_.LatLng(ptLatLng.lat, ptLatLng.lng);
      return this.mapCanvasProjection_.fromLatLngToDivPixel(latLng);
    }
    return this.fromLatLngToCenterPixel(ptLatLng);
  }

  /** Returns the pixel position relative to the map top-left. */
  fromLatLngToContainerPixel(ptLatLng) {
    if (this.mapCanvasProjection_) {
      const latLng = new this.maps_.LatLng(ptLatLng.lat, ptLatLng.lng);
      return this.mapCanvasProjection_.fromLatLngToContainerPixel(latLng);
    }

    const pt = this.fromLatLngToCenterPixel(ptLatLng);
    pt.x -= this.transform_.worldSize *
      Math.round(pt.x / this.transform_.worldSize);

    pt.x += this.transform_.width / 2;
    pt.y += this.transform_.height / 2;

    return pt;
  }

  /** Returns the LatLng for the given offset from the map top-left. */
  fromContainerPixelToLatLng(ptXY) {
    if (this.mapCanvasProjection_) {
      const latLng = this.mapCanvasProjection_.fromContainerPixelToLatLng(ptXY);
      return { lat: latLng.lat(), lng: latLng.lng() };
    }

    const ptxy = { ...ptXY };
    ptxy.x -= this.transform_.width / 2;
    ptxy.y -= this.transform_.height / 2;
    const ptRes = this.transform_.pointLocation(Point.convert(ptxy));

    ptRes.lng -= 360 * Math.round(ptRes.lng / 360); // convert 2 google format
    return ptRes;
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
    const bndT = (margins && margins[0]) || 0;
    const bndR = (margins && margins[1]) || 0;
    const bndB = (margins && margins[2]) || 0;
    const bndL = (margins && margins[3]) || 0;

    if (
      this.getWidth() - bndR - bndL > 0 && this.getHeight() - bndT - bndB > 0
    ) {
      const topLeftCorner = this.transform_.pointLocation(
        Point.convert({
          x: bndL - this.getWidth() / 2,
          y: bndT - this.getHeight() / 2,
        })
      );
      const bottomRightCorner = this.transform_.pointLocation(
        Point.convert({
          x: this.getWidth() / 2 - bndR,
          y: this.getHeight() / 2 - bndB,
        })
      );

      let res = [
        topLeftCorner.lat,
        topLeftCorner.lng, // NW
        bottomRightCorner.lat,
        bottomRightCorner.lng, // SE
        bottomRightCorner.lat,
        topLeftCorner.lng, // SW
        topLeftCorner.lat,
        bottomRightCorner.lng, // NE
      ];

      if (roundFactor) {
        res = res.map(r => Math.round(r * roundFactor) / roundFactor);
      }
      return res;
    }

    return [0, 0, 0, 0];
  }
}
