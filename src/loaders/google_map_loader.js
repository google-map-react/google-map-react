import { Loader } from '@googlemaps/js-api-loader';

let loadPromise_;
let resolveCustomPromise_;

const _customPromise = new Promise((resolve) => {
  resolveCustomPromise_ = resolve;
});

// TODO add libraries language and other map options
export default (bootstrapURLKeys) => {
  // call from outside google-map-react
  // will be as soon as loadPromise resolved
  if (!bootstrapURLKeys) {
    return _customPromise;
  }

  if (loadPromise_) {
    return loadPromise_;
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
    throw new Error('Google Map cannot be loaded outside browser env');
  }

  const { key, ...restKeys } = bootstrapURLKeys;

  const loader_ = new Loader({
    // need to keep key for backwards compatibility
    apiKey: key || '',
    ...restKeys,
  });

  loadPromise_ = loader_.load().then(() => {
    resolveCustomPromise_(window.google.maps);
    return window.google.maps;
  });

  resolveCustomPromise_(loadPromise_);

  return loadPromise_;
};
