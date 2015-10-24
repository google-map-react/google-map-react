###0.9v

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

###0.8v

Draggable markers support, examples comig soon.


###Mon Oct 5 2015

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


###Sun Oct 4 2015
Add minZoom calculation, to prevent situations when one map point can have multiple screen coordinates.

###Sun Oct 4 2015
Add ability to access to internal google api

```javascript
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)} />
```

(*to prevent warn message add _yesIWantToUseGoogleMapApiInternals_ property to GoogleMap*)


###Sun Oct 4 2015

Add: `defaultZoom` `defaultCenter` properties, it closes #9 #10

###Sat Oct 3 2015

Support `center` prop as `{lat, lng}` object

###Thu Oct 1 2015

Add `onClick`, `onZoomAnimationStart`, `onZoomAnimationEnd` events.
