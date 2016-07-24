const GOOGLE_TILE_SIZE = 256;
import log2 from './math/log2';

function latLng2World({ lat, lng }) {
  const sin = Math.sin(lat * Math.PI / 180);
  const x = (lng / 360 + 0.5);
  let y = (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);

  y = y < 0 // eslint-disable-line
    ? 0
    : y > 1
      ? 1
      : y;
  return { x, y };
}

function world2LatLng({ x, y }) {
  const n = Math.PI - 2 * Math.PI * y;

  // TODO test that this is faster
  // 360 * Math.atan(Math.exp((180 - y * 360) * Math.PI / 180)) / Math.PI - 90;
  return {
    lat: (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
    lng: x * 360 - 180,
  };
}

// Thank you wiki https://en.wikipedia.org/wiki/Geographic_coordinate_system
function latLng2MetersPerDegree({ lat }) {
  const phi = lat * Math.PI / 180;
  const metersPerLatDegree = 111132.92 - 559.82 * Math.cos(2 * phi) +
    1.175 * Math.cos(4 * phi) - 0.0023 * Math.cos(6 * phi);
  const metersPerLngDegree = 111412.84 * Math.cos(phi) -
    93.5 * Math.cos(3 * phi) + 0.118 * Math.cos(5 * phi);
  return { metersPerLatDegree, metersPerLngDegree };
}

function meters2LatLngBounds(meters, { lat, lng }) {
  const { metersPerLatDegree, metersPerLngDegree } = latLng2MetersPerDegree({ lat });

  const latDelta = 0.5 * meters / metersPerLatDegree;
  const lngDelta = 0.5 * meters / metersPerLngDegree;

  return {
    nw: {
      lat: lat - latDelta,
      lng: lng - lngDelta,
    },
    se: {
      lat: lat + latDelta,
      lng: lng + lngDelta,
    },
  };
}

function meters2WorldSize(meters, { lat, lng }) {
  const { nw, se } = meters2LatLngBounds(meters, { lat, lng });
  const nwWorld = latLng2World(nw);
  const seWorld = latLng2World(se);
  const w = Math.abs(seWorld.x - nwWorld.x);
  const h = Math.abs(seWorld.y - nwWorld.y);

  return { w, h };
}

const exports = {
  fitBounds({ nw, se }, { width, height }) {
    const EPS = 0.000000001;
    const nwWorld = latLng2World(nw);
    const seWorld = latLng2World(se);
    const dx = nwWorld.x < seWorld.x
      ? seWorld.x - nwWorld.x
      : (1 - nwWorld.x) + seWorld.x;
    const dy = seWorld.y - nwWorld.y;

    if (dx <= 0 && dy <= 0) {
      return null;
    }

    const zoomX = log2(width / GOOGLE_TILE_SIZE / dx);
    const zoomY = log2(height / GOOGLE_TILE_SIZE / dy);
    const zoom = Math.floor(EPS + Math.min(zoomX, zoomY));

    // TODO find center just unproject middle world point
    const middle = {
      x: nwWorld.x < seWorld.x // eslint-disable-line
        ? 0.5 * (nwWorld.x + seWorld.x)
        : nwWorld.x + seWorld.x - 1 > 0
          ? 0.5 * (nwWorld.x + seWorld.x - 1)
          : 0.5 * (1 + nwWorld.x + seWorld.x),
      y: 0.5 * (nwWorld.y + seWorld.y),
    };

    const scale = Math.pow(2, zoom);
    const halfW = width / scale / GOOGLE_TILE_SIZE / 2;
    const halfH = height / scale / GOOGLE_TILE_SIZE / 2;

    const newNW = world2LatLng({
      x: middle.x - halfW,
      y: middle.y - halfH,
    });

    const newSE = world2LatLng({
      x: middle.x + halfW,
      y: middle.y + halfH,
    });

    return {
      center: world2LatLng(middle),
      zoom,
      newBounds: {
        nw: newNW,
        se: newSE,
      },
    };
  },

  // -------------------------------------------------------------------
  // Helpers to calc some markers size

  meters2ScreenPixels(meters, { lat, lng }, zoom) {
    const { w, h } = meters2WorldSize(meters, { lat, lng });
    const scale = Math.pow(2, zoom);
    const wScreen = w * scale * GOOGLE_TILE_SIZE;
    const hScreen = h * scale * GOOGLE_TILE_SIZE;
    return {
      w: wScreen,
      h: hScreen,
    };
  },

  // --------------------------------------------------
  // Helper functions for working with svg tiles, (examples coming soon)

  tile2LatLng({ x, y }, zoom) {
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);

    return ({
      lat: (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
      lng: (x / Math.pow(2, zoom) * 360 - 180),
    });
  },

  latLng2Tile({ lat, lng }, zoom) {
    const worldCoords = latLng2World({ lat, lng });
    const scale = Math.pow(2, zoom);

    return {
      x: Math.floor(worldCoords.x * scale),
      y: Math.floor(worldCoords.y * scale),
    };
  },

  getTilesIds({ from, to }, zoom) {
    const scale = Math.pow(2, zoom);

    const ids = [];
    for (let x = from.x; x !== (to.x + 1) % scale; x = (x + 1) % scale) {
      for (let y = from.y; y !== (to.y + 1) % scale; y = (y + 1) % scale) {
        ids.push([zoom, x, y]);
      }
    }

    return ids;
  },
};

export const fitBounds = exports.fitBounds;
export const meters2ScreenPixels = exports.meters2ScreenPixels;
export const tile2LatLng = exports.tile2LatLng;
export const latLng2Tile = exports.latLng2Tile;
export const getTilesIds = exports.getTilesIds;
// export default exports;
