[![npm version](https://badge.fury.io/js/google-map-react.svg)](http://badge.fury.io/js/google-map-react)
[![Build Status](https://travis-ci.org/istarkov/google-map-react.svg?branch=master)](https://travis-ci.org/istarkov/google-map-react)

`google-map-react` is a component written over a small set of the [Google Maps API](https://developers.google.com/maps/). It allows you to render any React component on the Google Map. It is fully isomorphic and can render on a server. Additionally, it can render map components in the browser even if the Google Maps API is not loaded. It uses an internal, tweakable hover algorithm - every object on the map can be hovered.

It allows you to create interfaces like this [example](http://istarkov.github.io/google-map-react/map/main) *(You can scroll the table, zoom/move the map, hover/click on markers, and click on table rows)*


## Features

### Works with your Components

Instead of the ugly Google Maps markers, balloons and other map components, you can render your cool animated react components on the map.

### Isomorphic Rendering

It renders on the server. *(Welcome search engines)* *(you can disable javascript in browser dev tools, and reload any example page to see how it works)*

### Component Positions Calculated Independently of Google Maps API

It renders components on the map before (and even without) the Google Maps API loaded.

### Google Maps API Loads on Demand

There is no need to place a `<script src=` tag at top of page. The Google Maps API loads upon the first usage of the `GoogleMap` component.

### Internal Hover Algorithm

Now every object on the map can be hovered (however, you can still use css hover selectors if you want). If you try zooming out here [example](http://istarkov.github.io/google-map-react/map/main), you will still be able to hover on almost every map marker.

This algorithm allows you to tweak hover probability of map objects, for example making some objects "more hoverable". [distance_hover example with different hover probabilities](http://istarkov.github.io/google-map-react/map/distance_hover)

## Known Issues

* Small icons jiggle on Firefox (I don't see this in my older 'GoogleMap' version, so I will find the problem soon)


## Installation

### npm

```
npm install --save google-map-react
```

### bower

We no longer intend to support Bower. Please stop using Bower. NPM works very well for front-end development, and you should use it instead. ((c)Dan Abramov)
UMD AMD and other build are available under dist folder after `npm install`

## What's it Look Like?

In the simple case you just need to add `lat` `lng` props to any child of `GoogleMap` component.   
[simple example in action](http://istarkov.github.io/google-map-react/map/simple)

```javascript
import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';
import MyGreatPlace from './my_great_place.jsx';

export default class SimpleMapPage extends Component {
  static defaultProps = {
    center: {lat: 59.938043, lng: 30.337157},
    zoom: 9,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
  }

  render() {
    return (
       <GoogleMap
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}>
        <MyGreatPlace lat={59.955413} lng={30.337844} text={'A'} /* Kreyser Avrora */ />
        <MyGreatPlace {...this.props.greatPlaceCoords} text={'B'} /* road circle */ />
      </GoogleMap>
    );
  }
}
```

## Examples

* Placing react components on the map:
[simple](http://istarkov.github.io/google-map-react/map/simple/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_simple/simple_map_page.jsx))

* Custom map options:
[example](http://istarkov.github.io/google-map-react/map/options/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_options/options_map_page.jsx))

* Hover effects:
[simple hover](http://istarkov.github.io/google-map-react/map/simple_hover/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_simple_hover/simple_hover_map_page.jsx));
[distance hover](http://istarkov.github.io/google-map-react/map/distance_hover/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_distance_hover/distance_hover_map_page.jsx))

* GoogleMap events:
[example](http://istarkov.github.io/google-map-react/map/events/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_events/events_map_page.jsx))

* Example project:
[main](http://istarkov.github.io/google-map-react/map/main/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_main/main_map_block.jsx)); [balderdash](http://istarkov.github.io/google-map-react/map/balderdash/) (same source as main)

* Clustering example
[google-map-clustering-example](http://istarkov.github.io/google-map-clustering-example/)

* All api examples:
[google-map-react-examples](https://github.com/istarkov/google-map-react-examples)

* jsbin example
[jsbin example](https://jsbin.com/lepadusowo/edit?js,console,output)

## GoogleMap API

### parameters

#### apiKey (string) (_Deprecated use bootstrapURLKeys_)

Google maps api key. (Optional, but your map will be rate-limited with no key)

#### bootstrapURLKeys (object)

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

#### onClick (func)

`(x, y, lat, lng, event)`

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
(center, zoom, bounds, marginBounds)
```
```
[lat, lng] = center;
[topLat, leftLng, bottomLat, rightLng] = bounds;
```

#### onChildClick (func)

#### onChildMouseEnter (func)

#### onChildMouseLeave (func)

#### onZoomAnimationStart (func)

#### onZoomAnimationEnd (func)

#### distanceToMouse (func)

#### googleMapLoader (func)

#### onGoogleApiLoaded (func)
Directly access the maps API - *use at your own risk!*

```javascript
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)} />
```

To prevent warning message add _yesIWantToUseGoogleMapApiInternals_ property to GoogleMap

```javascript
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)}
                       yesIWantToUseGoogleMapApiInternals
 />
 ```

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

const size = {
  width: 640, // Map width in pixels
  height: 380, // Map height in pixels
};

const {center, zoom} = fitBounds({nw, se}, size);
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
const MARKER_SIZE = 40;
const greatPlaceStyle = {
  position: 'absolute',
  width: MARKER_SIZE,
  height: MARKER_SIZE,
  left: -MARKER_SIZE / 2,
  top: -MARKER_SIZE / 2
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

### Adding a searchbox

```javascript
import React from 'react';

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
    var input = React.findDOMNode(this.refs.input);
    this.searchBox = new google.maps.places.SearchBox(input);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }
  componentWillUnmount() {
    this.searchBox.removeListener('places_changed', this.onPlacesChanged);
  }
}
```

You will need to preload the google maps API, but `google-map-react` checks if the base api is already loaded,
and if so, uses it, so it won't load a second copy of the library.

```html
<script type="text/javascript" src="https://maps.google.com/maps/api/js?libraries=places&sensor=false"></script>
```

### Override the default minimum zoom

*WARNING*: Setting these options can break markers calculation, causing no homeomorphism between screen coordinates and map.

You can use the `minZoomOverride` associated with the `minZoom` in the custom map options to prevent a minimum zoom from being calculated:

```javascript
function createMapOptions() {
  return {
    minZoomOverride: true,
    minZoom: 2,
  };
}
```

---

(*Really big thanks to [April Arcus](https://github.com/AprilArcus) for documentation fixes*)   
(*thank you [Dan Abramov](http://gaearon.github.io/react-dnd/) for titles structure*)   
(*great thanks to [Vladimir Akimov](https://github.com/b2whats) he knows why*)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)   
