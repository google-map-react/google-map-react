###Sun Oct 4 2015
Add ability to access to internal google api

```javascript
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)} />
```

###Sun Oct 4 2015

Add: `defaultZoom` `defaultCenter` properties, it closes #9 #10

###Sat Oct 3 2015

Support `center` prop as `{lat, lng}` object

###Thu Oct 1 2015

Add `onClick`, `onZoomAnimationStart`, `onZoomAnimationEnd` events.
