import { Loader } from '@googlemaps/js-api-loader';

let loader_ = null;

let resolveCustomPromise_;

const _customPromise = new Promise((resolve) => {
  resolveCustomPromise_ = resolve;
});

// TODO add libraries language and other map options
export default (bootstrapURLKeys, heatmapLibrary) => {
  // call from outside google-map-react
  // will be as soon as loadPromise resolved
  if (!bootstrapURLKeys) {
    return _customPromise;
  }

  if (!bootstrapURLKeys.libraries) {
    bootstrapURLKeys.libraries = [];
  }

  if (heatmapLibrary && bootstrapURLKeys.indexOf('visualization') === -1) {
    console.warn(
      "heatmapLibrary will be deprecated in the future. Please use bootstrapURLKeys.libraries property instead (libraries=['visualization'])."
    );
    bootstrapURLKeys.libraries.push('visualization');
  }

  const libraries = heatmapLibrary
    ? [...bootstrapURLKeys.libraries, 'visualization']
    : [];

  if (process.env.NODE_ENV !== 'production') {
    if (Object.keys(bootstrapURLKeys).indexOf('callback') > -1) {
      const message = `"callback" key in bootstrapURLKeys is not allowed,
                      use onGoogleApiLoaded property instead`;
      // eslint-disable-next-line no-console
      console.error(message);
      throw new Error(message);
    }
  }

  if (typeof window === 'undefined') {
    throw new Error('google map cannot be loaded outside browser env');
  }

  if (!loader_) {
    loader_ = new Loader({ ...bootstrapURLKeys, libraries });
  }

  const loadPromise = loader_.load().then(() => {
    resolveCustomPromise_(window.google.maps);
    return window.google.maps;
  });

  resolveCustomPromise_(loadPromise);

  return loadPromise;
};
