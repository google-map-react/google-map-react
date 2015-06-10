let $script_ = null;

let _loadPromise;

// TODO add libraries language and other map options
module.exports = function googleMapLoader(apiKey) {
  if (!$script_) {
    $script_ = require('scriptjs');
  }

  if (_loadPromise) {
    return _loadPromise;
  }

  _loadPromise = new Promise((resolve, reject) => {
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

    const apiKeyString = apiKey ? `&key=${apiKey}` : '';

    $script_(`https://maps.googleapis.com/maps/api/js?callback=_$_google_map_initialize_$_${apiKeyString}`, () => {
      if (typeof window.google === 'undefined') {
        reject(new Error('google map initialization error (not loaded)'));
      }
    });
  });

  return _loadPromise;
};
