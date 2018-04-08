import GoogleMap from './google_map';
import {
  MapWithClusteringfactory,
} from './utils/clusterer/googleMapWithClustering.js';
import {
  animatedMarkerFactory,
} from './utils/clusterer/animatedMarkerFactory.js';

module.exports = GoogleMap;

module.exports.MapWithClusteringfactory = MapWithClusteringfactory;
module.exports.animatedMarkerFactory = animatedMarkerFactory;
