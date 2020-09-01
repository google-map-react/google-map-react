import GoogleMap from './google_map';

import {
  convertNeSwToNwSe,
  convertNwSeToNeSw,
  fitBounds,
  meters2ScreenPixels,
  tile2LatLng,
  latLng2Tile,
  getTilesIds,
} from './lib';

Object.assign(GoogleMap, {
  convertNeSwToNwSe,
  convertNwSeToNeSw,
  fitBounds,
  meters2ScreenPixels,
  tile2LatLng,
  latLng2Tile,
  getTilesIds,
});

export default GoogleMap;
