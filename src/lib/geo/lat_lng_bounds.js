import LatLng from './lat_lng';

export default class LatLngBounds {
  static convert = (a) => {
    if (!a || a instanceof LatLngBounds) return a;
    return new LatLngBounds(a);
  };

  constructor(sw, ne) {
    if (!sw) return;

    const latlngs = ne ? [sw, ne] : sw;

    for (let i = 0, len = latlngs.length; i < len; i++) {
      this.extend(latlngs[i]);
    }
  }

  extend(obj) {
    const sw = this._sw;
    const ne = this._ne;
    let sw2;
    let ne2;

    if (obj instanceof LatLng) {
      sw2 = obj;
      ne2 = obj;
    } else if (obj instanceof LatLngBounds) {
      sw2 = obj._sw;
      ne2 = obj._ne;

      if (!sw2 || !ne2) return this;
    } else {
      return obj
        ? this.extend(LatLng.convert(obj) || LatLngBounds.convert(obj))
        : this;
    }

    if (!sw && !ne) {
      this._sw = new LatLng(sw2.lat, sw2.lng);
      this._ne = new LatLng(ne2.lat, ne2.lng);
    } else {
      sw.lat = Math.min(sw2.lat, sw.lat);
      sw.lng = Math.min(sw2.lng, sw.lng);
      ne.lat = Math.max(ne2.lat, ne.lat);
      ne.lng = Math.max(ne2.lng, ne.lng);
    }

    return this;
  }

  getCenter = () =>
    new LatLng(
      (this._sw.lat + this._ne.lat) / 2,
      (this._sw.lng + this._ne.lng) / 2
    );

  getSouthWest = () => this._sw;

  getNorthEast = () => this._ne;

  getNorthWest = () => new LatLng(this.getNorth(), this.getWest());

  getSouthEast = () => new LatLng(this.getSouth(), this.getEast());

  getWest = () => this._sw.lng;

  getSouth = () => this._sw.lat;

  getEast = () => this._ne.lng;

  getNorth = () => this._ne.lat;
}
