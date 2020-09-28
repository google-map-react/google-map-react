## [unreleased(major)]

- Remove deprecated props (#952):
  - Remove `apiKey` which has been deprecated for a long time
  - Remove `heatmapLibrary` that we flagged as deprecated in #948
  - Remove `onBoundsChange` which has been deprecated for a long time

## [2.1.6] - 2020-09-25

- Change `componentWillReceiveProps` to `componentDidUpdate` (#950)

## [2.1.5] - 2020-09-22

- Use `@googlemaps/js-api-loader` (#946)
- Fix libraries usage (#946)

## [2.1.3] - 2020-09-01

- Produce CommonJS and UMD bundles (#932)

## [2.1.0] - 2020-08-31

- Add support to libraries: places, visualization, places, and geomerty. (#921)
And keeps support for previous heatMapLibrary prop to avoid breaking older usage.

## [2.0.4] - 2020-07-30

- Fix default and lib imports

## [2.0.2] - 2020-07-30

- Fix heatmap options not being updated (#878)

## [2.0.1] - 2020-07-30

- On resize it's getting undefined minZoom (#864)
- Moves marker dispatcher binds to componentDidMount (#873)

## [2.0.0] - 2020-07-30

### Changed

- Rewrite library using [create-react-library](https://www.npmjs.com/package/create-react-library)
- **Breaking** Move `google-map-react/utils` to module import, meaning that instead of doing: `import { utilName } from 'google-map-react/utils` you will do `import { utilName } from google-map-react`

## [1.1.7] - 2020-03-17

- Add dev folders to .gitignore (#835)

## [1.1.6] - 2020-02-04

- Updated China base url (#827)

## [1.1.5] - 2019-09-20

- Add UNSAFE_ prefix to deprecated lifecycle methods (#778)
- Move prop-types to dependencies (#769)
- Add shouldUnregisterMapOnUnmount prop to persist map object on unmount (#759)
- Add prop 'onDragEnd' (#754)

## [1.1.4] - 2019-04-03

- Revert #726 Google Map loader respecting the app language change  (#738)
- Revert #722 Add shouldUnregisterMapOnUnmount prop to persist map object on unmount (#739)

## [1.1.3] - 2019-04-01

- Google Map loader respecting the app language change (#726)
- Add shouldUnregisterMapOnUnmount prop to persist map object on unmount (#722)
- Fix: Update heatmap layer when heatmap positions prop changes (#728)

## [1.1.2] - 2018-12-18

- Add React 16 createPortal with backwards compatibility  (#696)

## [1.1.1] - 2018-10-21

- Revert #593 (had a problem with the way of importing libraries) (#679)

## [1.1.0] - 2018-10-08

- Add math abs to avoid negative values when calculating zoom (#655)
- Pass map instance to onDrag handler (#656)
- Added feature: update heat map on data change + fix linting (#593)

## [1.0.9] - 2018-09-29

- Custom div style options (#634)

## [1.0.8] - 2018-09-21

- Revert #643 Use React 16 map portal to render map overlay. Was causing problems for users  (#645)using React version < 16

## [1.0.7] - 2018-09-20

- Add passive scroll (#631)
- Use React 16 map portal to render map overlay (#643)

## [1.0.6] - 2018-08-03

- Fix bug in fromContainerPixelToLatLng() (#620)
- Add prop `onTilesLoaded` (#615)

## [1.0.5] - 2018-06-26

- Fix build (#605)
- Remove marker jiggle, Issue #575 (#603)

## [1.0.4] - 2018-06-11

- Avoid null error (#570)
- Add guard around mapDom event listener (#594)
- Move dep for react-dom (#592)

## [1.0.3] - 2018-05-17

-: Scales tiles properly (#580)

## [1.0.2] - 2018-05-13

- Move react-dom to dependencies (#577)

## [1.0.1] - 2018-05-12

- Add weights to the heatmap (#572)

## [1.0.0] - 2018-04-27

- Fix soom animation for google maps' version 3.32 (#559)
- Improves to documentation (#548)
- Remove lodash completely, using our own functions, now the build size is 4 times smaller. (#535)
- Fixes some of the examples in the documentation (#533)
- & #563 Fix error Target container is not a DOM element (#555)

## [0.34.0] - 2018-04-27

- Upgrade .babelrc (#521)
- Call zoomControlClickTime on all clicks (#211)
- Set latest release version as default if user does not specify a version (#530)

## [0.33.0] - 2018-03-09

- Added loose to es2015 for IE10, IE11 support (#504)
- Fix error about fromLatLngToDivPixel (#517)
- Accept 0 as zoom value (#525)
- Update package.json (#529)

## [0.30.0] - 2018-02-12

- Add heatmap functionality (#441)
- Fix support for china (#496)

## [0.28.0] - 2018-01-18

- Add support for China (#494)

## [0.27.0] - 2018-01-04

- Add fullscreen check for Internet explorer 11 (#485)
- Make `resetBoundsOnResize` preserve center when full-screened (#482)
- Updates yarn.lock to fix @mapbox/point-geometry warning (#483)

## [0.9]

Add prop `onDragEnd` to react on the `dragend` event

Add [google-map-clustering-example](https://github.com/istarkov/google-map-clustering-example)

Add prop `onTilesLoaded` to react on the `tilesloaded` event

Add: `bootstrapURLKeys` (object) instead of `apiKey` prop

(`apiKey` prop is now deprecated)

Example:

```javascript
<GoogleMap
  bootstrapURLKeys={{
    key: API_KEY,
    language: 'ru',
    ...otherUrlParams,
  }}
>
```

## [0.8]

Draggable markers support, examples comig soon.

## Mon Oct 5 2015

Add `OnChange({center, zoom, bounds: {nw, se}, size, ...oherMapProps})`

Add deprecation warning to `onBoundsChange`

Add `utils` functions, with `fitBounds` and other functions

```javascript
  import { fitBounds } from 'google-map-react/utils';

  const bounds = {
    nw: {
      lat: 50.01038826014866,
      lng: -118.6525866875,
     },
     se: {
      lat: 32.698335045970396,
      lng: -92.0217273125,
     },
  };

  const size = {
    width: 640, // Map width in pixels
    height: 380, // Map height in pixels
  };

  const {center, zoom} = fitBounds({nw, se}, size);
```


## Sun Oct 4 2015
Add minZoom calculation, to prevent situations when one map point can have multiple screen coordinates.

## Sun Oct 4 2015
Add ability to access to internal google api

```javascript
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)} />
```

(*to prevent warn message add _yesIWantToUseGoogleMapApiInternals_ property to GoogleMap*)


## Sun Oct 4 2015

Add: `defaultZoom` `defaultCenter` properties, it closes #9 #10

## Sat Oct 3 2015

Support `center` prop as `{lat, lng}` object

## Thu Oct 1 2015

Add `onClick`, `onZoomAnimationStart`, `onZoomAnimationEnd` events.
