import { wrap } from './wrap.js';

export default class LatLng {
  static convert = (a) => {
    if (a instanceof LatLng) {
      return a;
    }
    if (Array.isArray(a)) {
      return new LatLng(a[0], a[1]);
    }
    return a;
  }

  constructor(lat, lng) {
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
    }
    this.lat = +lat;
    this.lng = +lng;
  }

  wrap() {
    return new LatLng(this.lat, wrap(this.lng, -180, 180));
  }
}
