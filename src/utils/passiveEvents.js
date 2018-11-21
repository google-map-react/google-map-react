// feature detection for passive support
// see: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
function hasPassiveSupport() {
  let passiveSupported = false;

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        passiveSupported = true;
      },
    });

    window.addEventListener('test', options, options);
    window.removeEventListener('test', options, options);
  } catch (err) {
    passiveSupported = false;
  }

  return passiveSupported;
}

export default function addPassiveEventListener(
  element,
  eventName,
  func,
  capture
) {
  element.addEventListener(
    eventName,
    func,
    hasPassiveSupport()
      ? {
          capture,
          passive: true,
        }
      : capture
  );
}
