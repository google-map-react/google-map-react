## [2.1.0] - 2020-08-31

- #921 Add support to libraries: places, visualization, places, and geomerty.
And keeps support for previous heatmapLibrary prop to avoid breaking older usage.

## [2.0.4] - 2020-07-30

- Fix default and lib imports

## [2.0.2] - 2020-07-30

- #878 Fix heatmap options not being updated

## [2.0.1] - 2020-07-30

- #864 On resize it's getting undefined minZoom
- #873 Moves marker dispatcher binds to componentDidMount

## [2.0.0] - 2020-07-30

### Changed

- Rewrite library using [create-react-library](https://www.npmjs.com/package/create-react-library)
- **Breaking** Move `google-map-react/utils` to module import, meaning that instead of doing: `import { utilName } from 'google-map-react/utils` you will do `import { utilName } from google-map-react`

## [1.1.7] - 2020-03-17

- #835 Add dev folders to .gitignore

## [1.1.6] - 2020-02-04

- #827 Updated China base url

## [1.1.5] - 2019-09-20

- #778 Add UNSAFE_ prefix to deprecated lifecycle methods
- #769 Move prop-types to dependencies
- #759 Add shouldUnregisterMapOnUnmount prop to persist map object on unmount
- #754 Add prop 'onDragEnd'

## [1.1.4] - 2019-04-03

- #738 Revert #726 Google Map loader respecting the app language change 
- #739 Revert #722 Add shouldUnregisterMapOnUnmount prop to persist map object on unmount

## [1.1.3] - 2019-04-01

- #726 Google Map loader respecting the app language change
- #722 Add shouldUnregisterMapOnUnmount prop to persist map object on unmount
- #728 Fix: Update heatmap layer when heatmap positions prop changes

## [1.1.2] - 2018-12-18

- #696 Add React 16 createPortal with backwards compatibility 

## [1.1.1] - 2018-10-21

- #679 Revert #593 (had a problem with the way of importing libraries)

## [1.1.0] - 2018-10-08

- #655 Add math abs to avoid negative values when calculating zoom
- #656 Pass map instance to onDrag handler
- #593 Added feature: update heat map on data change + fix linting

## [1.0.9] - 2018-09-29

- #634 Custom div style options

## [1.0.8] - 2018-09-21

- #645 Revert #643 Use React 16 map portal to render map overlay. Was causing problems for users using React version < 16

## [1.0.7] - 2018-09-20

- #631 Add passive scroll
- #643 Use React 16 map portal to render map overlay

## [1.0.6] - 2018-08-03

- #620 Fix bug in fromContainerPixelToLatLng()
- #615 Add prop `onTilesLoaded`

## [1.0.5] - 2018-06-26

- #605 Fix build
- #603 Remove marker jiggle, Issue #575

## [1.0.4] - 2018-06-11

- #570 Avoid null error
- #594 Add guard around mapDom event listener
- #592 Move dep for react-dom

## [1.0.3] - 2018-05-17

- #580: Scales tiles properly

## [1.0.2] - 2018-05-13

- #577 Move react-dom to dependencies

## [1.0.1] - 2018-05-12

- #572 Add weights to the heatmap

## [1.0.0] - 2018-04-27

- #559 Fix soom animation for google maps' version 3.32
- #548 Improves to documentation
- #535 Remove lodash completely, using our own functions, now the build size is 4 times smaller.
- #533 Fixes some of the examples in the documentation
- #555 & #563 Fix error Target container is not a DOM element

## [0.34.0] - 2018-04-27

- #521 Upgrade .babelrc
- #211 Call zoomControlClickTime on all clicks
- #530 Set latest release version as default if user does not specify a version

## [0.33.0] - 2018-03-09

- #504 Added loose to es2015 for IE10, IE11 support
- #517 Fix error about fromLatLngToDivPixel
- #525 Accept 0 as zoom value
- #529 Update package.json

## [0.30.0] - 2018-02-12

- #441 Add heatmap functionality
- #496 Fix support for china

## [0.28.0] - 2018-01-18

- #494 Add support for China

## [0.27.0] - 2018-01-04

- #485 Add fullscreen check for Internet explorer 11
- #482 Make `resetBoundsOnResize` preserve center when full-screened
- #483 Updates yarn.lock to fix @mapbox/point-geometry warning

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
