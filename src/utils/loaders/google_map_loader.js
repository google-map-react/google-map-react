import find from 'lodash/find';
import reduce from 'lodash/reduce';

let $script_ = null;

let loadPromise_;

let resolveCustomPromise_;
const _customPromise = new Promise(resolve => {
  resolveCustomPromise_ = resolve;
});

// TODO add libraries language and other map options
export default function googleMapLoader(bootstrapURLKeys) {
  if (!$script_) {
    $script_ = require('scriptjs');
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
      if (find(Object.keys(bootstrapURLKeys), 'callback')) {
        console.error('"callback" key in bootstrapURLKeys is not allowed, ' + // eslint-disable-line
                      'use onGoogleApiLoaded property instead');
        throw new Error('"callback" key in bootstrapURLKeys is not allowed, ' +
                        'use onGoogleApiLoaded property instead');
      }
    }

    const queryString = reduce(
      Object.keys(bootstrapURLKeys),
      (r, key) => r + `&${key}=${bootstrapURLKeys[key]}`,
      ''
    );

    $script_(
      `https://maps.googleapis.com/maps/api/js?callback=_$_google_map_initialize_$_${queryString}`,
      () =>
        typeof window.google === 'undefined' &&
          reject(new Error('google map initialization error (not loaded)'))
    );
  });

  resolveCustomPromise_(loadPromise_);

  return loadPromise_;
}
