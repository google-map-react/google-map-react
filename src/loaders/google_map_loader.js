const BASE_URL = 'https://maps';
const DEFAULT_URL = `${BASE_URL}.googleapis.com`;
const API_PATH = '/maps/api/js?callback=googleMapsAPILoadedPromise';
const EVENT_GMAPS_LOADED = 'EVENT_GMAPS_LOADED';

const getBaseUrl = region => {
  if (region && region.toLowerCase() === 'cn') {
    return `${BASE_URL}.google.cn`;
  }
  return DEFAULT_URL;
};

let currentResolver = null;
let lastBaseUrl = '';
let lastScriptUrl = '';
let googleMapsPromise;

const destroyOldGoogleMapsInstance = url => {
  document
    .querySelectorAll(`script[src^='${url}']`)
    .forEach(script => script.remove());
  if (window.google) delete window.google.maps;
};

// Callback for the Google Maps API src
window.googleMapsAPILoadedPromise = () =>
  window.dispatchEvent(new CustomEvent(EVENT_GMAPS_LOADED));

const getScriptUrl = bootstrapURLKeys => {
  const baseUrl = getBaseUrl(bootstrapURLKeys.region);
  const params = Object.keys(bootstrapURLKeys).reduce(
    (r, key) => `${r}&${key}=${bootstrapURLKeys[key]}`,
    ''
  );
  return `${baseUrl}${API_PATH}${params}`;
};

const loadScript = url => {
  const script = document.createElement('script');

  script.type = 'text/javascript';
  script.async = true;
  script.src = url;
  document.querySelector('head').appendChild(script);

  return new Promise(resolve => {
    if (currentResolver) {
      window.removeEventListener(EVENT_GMAPS_LOADED, currentResolver);
    }
    currentResolver = () => {
      resolve();
    };
    window.addEventListener(EVENT_GMAPS_LOADED, currentResolver);
  });
};

const loadGoogleMaps = bootstrapURLKeys =>
  new Promise(async resolve => {
    lastScriptUrl = getScriptUrl(bootstrapURLKeys);
    await loadScript(lastScriptUrl);
    resolve(window.google.maps);
  });

export default bootstrapURLKeys => {
  if (typeof window === 'undefined') {
    throw new Error('google map cannot be loaded outside browser env');
  }

  if (process.env.NODE_ENV !== 'production') {
    if (Object.keys(bootstrapURLKeys).includes('callback')) {
      const message = `'callback' key in bootstrapURLKeys is not allowed, use onGoogleapiLoadedPromise property instead`;
      // eslint-disable-next-line no-console
      console.error(message);
      throw new Error(message);
    }
  }
  if (googleMapsPromise) {
    if (lastScriptUrl !== getScriptUrl(bootstrapURLKeys)) {
      destroyOldGoogleMapsInstance(lastBaseUrl);
      googleMapsPromise = loadGoogleMaps(bootstrapURLKeys);
    }
    return googleMapsPromise;
  }

  googleMapsPromise = loadGoogleMaps(bootstrapURLKeys);
  lastBaseUrl = getBaseUrl(bootstrapURLKeys.region);

  return googleMapsPromise;
};
