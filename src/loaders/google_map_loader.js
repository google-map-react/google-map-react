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

  const libraries = [...bootstrapURLKeys.libraries];

  // note: heatmapLibrary will be deprecated on next major
  if (heatmapLibrary) {
    // if heatmapLibrary is present
    // check if we need to add visualization library
    if (libraries.length === 0 || !libraries.includes('visualization')) {
      // if the array isEmpty or visualization is
      // not present, push the visualization library
      libraries.push('visualization');
    }
    console.warn(
      "heatmapLibrary will be deprecated in the future. Please use { libraries: ['visualization'] } in bootstrapURLKeys property instead"
    );
  }

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
    const { key, ...restKeys } = bootstrapURLKeys;

    loader_ = new Loader({
      // need to keep key for backwards compatibility
      apiKey: key || '',
      ...restKeys,
      libraries,
    });
  }

  const loadPromise = loader_.load().then(() => {
    resolveCustomPromise_(window.google.maps);
    return window.google.maps;
  });

  resolveCustomPromise_(loadPromise);

  return loadPromise;
};
