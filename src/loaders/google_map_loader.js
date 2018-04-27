const BASE_URL = 'https://maps';
const DEFAULT_URL = `${BASE_URL}.googleapis.com`;
const API_PATH = '/maps/api/js?callback=_$_google_map_initialize_$_';

const getUrl = region => {
  if (region && region.toLowerCase() === 'cn') {
    return `${BASE_URL}.google.cn`;
  }
  return DEFAULT_URL;
};

let $script_ = null;

let loadPromise_;

let resolveCustomPromise_;

const _customPromise = new Promise(resolve => {
  resolveCustomPromise_ = resolve;
});

// TODO add libraries language and other map options
export default (bootstrapURLKeys, heatmapLibrary) => {
  if (!$script_) {
    $script_ = require('scriptjs'); // eslint-disable-line
  }

  // call from outside google-map-react
  // will be as soon as loadPromise_ resolved
  if (!bootstrapURLKeys) {
    return _customPromise;
  }

  if (loadPromise_) {
    return loadPromise_;
  }

  loadPromise_ = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('google map cannot be loaded outside browser env'));
      return;
    }

    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    if (typeof window._$_google_map_initialize_$_ !== 'undefined') {
      reject(new Error('google map initialization error'));
    }

    window._$_google_map_initialize_$_ = () => {
      delete window._$_google_map_initialize_$_;
      resolve(window.google.maps);
    };

    if (process.env.NODE_ENV !== 'production') {
      if (Object.keys(bootstrapURLKeys).indexOf('callback') > -1) {
        const message = `"callback" key in bootstrapURLKeys is not allowed,
                          use onGoogleApiLoaded property instead`;
        // eslint-disable-next-line no-console
        console.error(message);
        throw new Error(message);
      }
    }

    const params = Object.keys(bootstrapURLKeys).reduce(
      (r, key) => `${r}&${key}=${bootstrapURLKeys[key]}`,
      ''
    );

    const baseUrl = getUrl(bootstrapURLKeys.region);
    const libraries = heatmapLibrary ? '&libraries=visualization' : '';

    $script_(
      `${baseUrl}${API_PATH}${params}${libraries}`,
      () =>
        typeof window.google === 'undefined' &&
        reject(new Error('google map initialization error (not loaded)'))
    );
  });

  resolveCustomPromise_(loadPromise_);

  return loadPromise_;
};
