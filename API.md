## GoogleMap API

### parameters

#### apiKey (string) (_Deprecated use bootstrapURLKeys_)

Google maps api key.

#### bootstrapURLKeys (object)

Example:

```javascript
<GoogleMap
  bootstrapURLKeys={{
    key: API_KEY,
    language: 'ru',
    region: 'ru',
    ...otherUrlParams,
  }}
>
```

#### defaultCenter (array or object)

`[lat, lng]` or `{ lat: lat, lng: lng}`
Default lat/lng at which to center the map - changing this prop throws a warning

#### center (array or object)

`[lat, lng]` or `{ lat: lat, lng: lng}`
Lat/lng at which to center the map

#### defaultZoom: (number)

Default map zoom level - changing this prop throws a warning

#### zoom (number)

Map zoom level

#### hoverDistance (number)

Default: 30

#### margin (array)

In onChange callback, gives you a marginBounds argument property, where lat lng will be shifted using margin you have set. For example, you could use a simple check pointInRect to not show Markers near map bounds.

#### debounced (bool)

Default: true

#### layerTypes (string[])

You can add some "layers" for map like a
[traffic](https://developers.google.com/maps/documentation/javascript/examples/layer-traffic) or
[transit](https://developers.google.com/maps/documentation/javascript/examples/layer-transit)

```javascript
layerTypes={['TrafficLayer', 'TransitLayer']}
```

### callbacks

#### options (func|object)

Set map options such as controls positions / styles, etc.

Example:

```javascript
createMapOptions: function (maps) {
    return {
      panControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
    }
  }

 <GoogleMap  options={createMapOptions} ... />
```
See "Custom map options example" in Examples below for a further example.
See full options at [Google Maps Javascript API docs](https://developers.google.com/maps/documentation/javascript/controls#ControlOptions)

#### onClick (func)

```
({ x, y, lat, lng, event })
```

The `event` prop in args is the outer div onClick event, not the gmap-api 'click' event.

Example:

 ```javascript
 _onClick = ({x, y, lat, lng, event}) => console.log(x, y, lat, lng, event)
 // ES5 users
 function _onClick(obj){ console.log(obj.x, obj.y, obj.lat, obj.lng, obj.event);}

 <GoogleMap  onClick={_onClick} ... />
 ```

#### onBoundsChange (func) (_Deprecated use onChange_)

```
({ center, zoom, bounds, marginBounds })
```
```
[lat, lng] = center;
[topLat, leftLng, bottomLat, rightLng] = bounds;
```

#### resetBoundsOnResize (bool)

When true this will reset the map bounds if the parent resizes.

Default: false

#### onChildClick (func)

#### onChildMouseEnter (func)

#### onChildMouseLeave (func)

#### onZoomAnimationStart (func)

#### onZoomAnimationEnd (func)

#### onMapTypeIdChange (func)
When the user changes the map type (HYBRID, ROADMAP, SATELLITE, TERRAIN) this fires

#### distanceToMouse (func)

#### googleMapLoader (func)

#### onGoogleApiLoaded (func)
Directly access the maps API - *use at your own risk!*

#### onTilesLoaded (func)
This function is called when the visible tiles have finished loading.

```javascript
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)} />
```

To prevent warning message add _yesIWantToUseGoogleMapApiInternals_ property to GoogleMap

```javascript
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)}
                       yesIWantToUseGoogleMapApiInternals
 />
 ```

#### overlayViewDivStyle (object)

Add custom style to `div` (marker container element) created by OverlayView, for example: `{pointerEvents: 'none'}`.

## Child Component API

### parameters

#### lat (number)
Latitude to place the marker component

#### lng (number)
Longitude to place the marker component

#### $hover (bool) [automatic]
GoogleMap passes a $hover prop to hovered components. To detect hover it an uses internal mechanism, explained in x_distance_hover example

Example:
```javascript
render() {
    const style = this.props.$hover ? greatPlaceStyleHover : greatPlaceStyle;

    return (
       <div style={style}>
          {this.props.text}
       </div>
    );
  }
  ```


## Utility functions

#### fitBounds (func)
   Use fitBounds to get zoom and center.

Example:

```javascript
import { fitBounds } from 'google-map-react/utils';

const bounds = {
  nw: {
    lat: 50.01038826014866,
    lng: -118.6525866875
  },
  se: {
    lat: 32.698335045970396,
    lng: -92.0217273125
  }
};

// Or

const bounds = {
  ne: {
    lat: 50.01038826014866,
    lng: -118.6525866875
  },
  sw: {
    lat: 32.698335045970396,
    lng: -92.0217273125
  }
};

const size = {
  width: 640, // Map width in pixels
  height: 380, // Map height in pixels
};

const {center, zoom} = fitBounds(bounds, size);
```

#### tile2LatLng (func)

#### latLng2Tile (func)

#### getTilesIds (func)

## Tips

### My map doesn't appear

Make sure the container element has width and height. The map will try to fill the parent container, but if the container has no size, the map will collapse to 0 width / height.

### Positioning a marker

Initially any map object has its top left corner at lat lng coordinates. It's up to you to set the object origin to 0,0 coordinates.

Example (centering the marker):

```javascript
const greatPlaceStyle = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)';
}
```

```javascript
render() {
  return (
    <div style={greatPlaceStyle}>
      {this.props.text}
    </div>
  );
}
```

### Rendering in a modal

If at the moment of GoogleMap control created, a modal has no size (width,height=0) or/and not displayed, the simple solution is to add something like this in render:

```javascript
render() {
  return this.props.modalIsOpen
    ? <GoogleMap />
    : null;
}
```

### Adding a SearchBox

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchBox extends React.Component {
  static propTypes = {
    placeholder: React.PropTypes.string,
    onPlacesChanged: React.PropTypes.func
  }
  render() {
    return <input ref="input" {...this.props} type="text"/>;
  }
  onPlacesChanged = () => {
    if (this.props.onPlacesChanged) {
      this.props.onPlacesChanged(this.searchBox.getPlaces());
    }
  }
  componentDidMount() {
    var input = ReactDOM.findDOMNode(this.refs.input);
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }
  componentWillUnmount() {
    // https://developers.google.com/maps/documentation/javascript/events#removing
    google.maps.event.clearInstanceListeners(this.searchBox);
  }
}
```

You will need to preload the google maps API, but `google-map-react` checks if the base api is already loaded,
and if so, uses it, so it won't load a second copy of the library.

```html
<script type="text/javascript" src="https://maps.google.com/maps/api/js?libraries=places"></script>
```

### Override the default minimum zoom

*WARNING*: Setting this option can break markers calculation, causing no homeomorphism between screen coordinates and map.

You can use the `minZoom` custom option to prevent our minimum-zoom calculation:

```javascript
function createMapOptions() {
  return {
    minZoom: 2,
  };
}
```

### Define touch device behavior of scrolling & panning for the map

Google Maps provides control over the behavior of touch based interaction with the map.
For example, on mobile devices swiping up on the map might mean two things: Scrolling the container or panning the map.
To resolve this ambigiuity, you can use the custom map option `gestureHandling` to get the required behavior.

```javascript
function createMapOptions() {
  return {
    gestureHandling: 'greedy' // Will capture all touch events on the map towards map panning
  }
}
```

The default setting is `gestureHandling:auto` which tries to detect based on the page/content sizes if a `greedy` setting is best (no scrolling is required) or `cooperative` (scrolling is possible)

For more details see the [google documentation](https://developers.google.com/maps/documentation/javascript/interaction) for this setting.

### Heatmap Layer

For enabling heatmap layer, just add `heatmapLibrary={true}` and provide data for heatmap in `heatmap` as props.

#### Example

```javascript
<GoogleMapReact
    bootstrapURLKeys={{ key: [YOUR_KEY] }}
    zoom={zoom}
    center={center}
    heatmapLibrary={true}
    heatmap={{data}}
  >
    {markers}
  </GoogleMapReact>
```

#### Important Note

If you have multiple `GoogleMapReact` components in project and you want to use heatmap layer so provide `heatmapLibrary={true}` for all `GoogleMapReact` components so component will load heatmap library at the beginning with google map api.

### Localizing the Map

This is done by setting bootstrapURLKeys.[language](https://developers.google.com/maps/documentation/javascript/localization#Language) and bootstrapURLKeys.[region](https://developers.google.com/maps/documentation/javascript/localization#Region). Also notice that setting region to 'cn' is required when using the map from within China, see [google documentation](https://developers.google.com/maps/documentation/javascript/localization#GoogleMapsChina) for more info. Setting 'cn' will result in use of the specific API URL for China.
