// http://stackoverflow.com/questions/5899783/detect-safari-chrome-ie-firefox-opera-with-user-agent
let detectBrowserResult_ = null;

export default function detectBrowser() {
  if (detectBrowserResult_) {
    return detectBrowserResult_;
  }

  if (typeof navigator !== 'undefined') {
    const isExplorer = navigator.userAgent.indexOf('MSIE') > -1;
    const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
    const isOpera = navigator.userAgent.toLowerCase().indexOf('op') > -1;

    let isChrome = navigator.userAgent.indexOf('Chrome') > -1;
    let isSafari = navigator.userAgent.indexOf('Safari') > -1;

    if (isChrome && isSafari) {
      isSafari = false;
    }

    if (isChrome && isOpera) {
      isChrome = false;
    }

    detectBrowserResult_ = {
      isExplorer,
      isFirefox,
      isOpera,
      isChrome,
      isSafari,
    };
    return detectBrowserResult_;
  }

  detectBrowserResult_ = {
    isChrome: true,
    isExplorer: false,
    isFirefox: false,
    isOpera: false,
    isSafari: false,
  };

  return detectBrowserResult_;
}
