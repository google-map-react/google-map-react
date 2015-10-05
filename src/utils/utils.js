const GOOGLE_TILE_SIZE = 256;

function latLng2World({lat, lng}) {
  const sin = Math.sin(lat * Math.PI / 180);
  const x = (lng / 360 + 0.5);
  let y = (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);

  y = y < -1 // eslint-disable-line
    ? -1
    : y > 1
      ? 1
      : y;
  return {x, y};
}

function world2LatLng({x, y}) {
  const n = Math.PI - 2 * Math.PI * y;

  return {
    lat: (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
    lng: x * 360 - 180,
  };
}

export default {
  fitBounds({nw, se}, {width, height}) {
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

    const zoomX = Math.log2(width / GOOGLE_TILE_SIZE / dx);
    const zoomY = Math.log2(height / GOOGLE_TILE_SIZE / dy);
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

    return {
      center: world2LatLng(middle),
      zoom,
    };
  },

  // --------------------------------------------------
  // Helper functions for working with svg tiles, (examples coming soon)

  tile2LatLng({x, y}, zoom) {
    const n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);

    return ({
      lat: (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
      lng: (x / Math.pow(2, zoom) * 360 - 180),
    });
  },

  latLng2Tile({lat, lng}, zoom) {
    const worldCoords = latLng2World({lat, lng});
    const scale = Math.pow(2, zoom);

    return {
      x: Math.floor(worldCoords.x * scale),
      y: Math.floor(worldCoords.y * scale),
    };
  },

  getTilesIds({from, to}, zoom) {
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
