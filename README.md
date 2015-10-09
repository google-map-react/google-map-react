[![npm version](https://badge.fury.io/js/google-map-react.svg)](http://badge.fury.io/js/google-map-react)
[![Build Status](https://travis-ci.org/istarkov/google-map-react.svg?branch=master)](https://travis-ci.org/istarkov/google-map-react)

`google-map-react` is a component written over a small set of the [Google Maps API](https://developers.google.com/maps/). It allows you to render any React component on the Google Map. It is fully isomorphic and can render on a server. Additionally, it can render map components in the browser even if the Google Maps API is not loaded. It uses an internal, tweakable hover algorithm - every object on the map can be hovered. 

It allows you to create interfaces like this [example](http://istarkov.github.io/google-map-react/map/main) *(You can scroll the table, zoom/move the map, hover/click on markers, and click on table rows)*


##Features

###Works with your Components
Instead of the ugly Google Maps markers, balloons and other map components, you can render your cool animated react components on the map.

###Isomorphic Rendering
It renders on the server. *(Welcome search engines)* *(you can disable javascript in browser dev tools, and reload any example page to see how it works)*

###Component Positions Calculated Independently of Google Maps API
It renders components on the map before (and even without) the Google Maps API loaded.

###Google Maps API Loads on Demand
There is no need to place a `<script src=` tag at top of page. The Google Maps API loads upon the first usage of the `GoogleMap` component.

###Internal Hover Algorithm
Now every object on the map can be hovered (however, you can still use css hover selectors if you want). If you try zooming out here [example](http://istarkov.github.io/google-map-react/map/main), you will still be able to hover on almost every map marker.

This algorithm allows you to tweak hover probability of map objects, for example making some objects "more hoverable". [distance_hover example with different hover probabilities](http://istarkov.github.io/google-map-react/map/distance_hover)

##Known Issues
* Small icons jiggle on Firefox (I don't see this in my older 'GoogleMap' version, so I will find the problem soon)


##Installation

### npm
```
npm install --save google-map-react
```

### bower
```
bower install --save google-map-react
```
The global will be available at: `window.GoogleMapReact`


##What's it Look Like? 
In the simple case you just need to add `lat` `lng` props to any child of `GoogleMap` component.   
[simple example in action](http://istarkov.github.io/google-map-react/map/simple)

```jsx
import React, {PropTypes, Component} from 'react/addons';
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

## API
### parameters

####apiKey (string)
Google maps api key. (Optional, but your map will be rate-limited with no key)

####defaultCenter (array or object)
`[lat, lng]` or `{ lat: lat, lng: ln}`
Default lat/lng at which to center the map - changing this prop throws a warning

####defaultCenter (array or object)
`[lat, lng]` or `{ lat: lat, lng: ln}`
Lat/lng at which to center the map

####defaultZoom: (number)
Default map zoom level - changing this prop throws a warning

####zoom (number)
Map zoom level

####hoverDistance (number)
Default: 30

####margin (array)

####debounced (bool)
Default: true

### callbacks

####options (func)
Set map options such as controls positions / styles, etc.

Example:

```jsx
createMapOptions: function (maps) {
    return {
      panControl: false,
      mapTypeControl: false,
      scrollwheel: false,
      styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
    }
  }

 <GoogleMap  onptions={createMapOptions} ... />
```
See "Custom map options example" in Examples below for a further example.

####onClick (func)
`{x, y, lat, lng, event}`

The `event` prop in args is the outer div onClick event, not the gmap-api 'click' event.

Example:

 ```jsx
 _onClick = ({x, y, lat, lng, event}) => console.log(x, y, lat, lng, event)
 // ES5 users
 function _onClick(obj){ console.log(obj.x, obj.y, obj.lat, obj.lng, obj.event);}

 <GoogleMap  onClick={_onClick} ... />
 ```

####onBoundsChange (func)
####onChildClick (func)
####onChildMouseEnter (func)
####onChildMouseLeave (func)
####onZoomAnimationStart (func)
####onZoomAnimationEnd (func)
####distanceToMouse (func)
####googleMapLoader (func)

####onGoogleApiLoaded (func)
Directly access the maps API - *use at your own risk!*

```jsx
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)} />
```

To prevent warning message add _yesIWantToUseGoogleMapApiInternals_ property to GoogleMap

```jsx
<GoogleMap  onGoogleApiLoaded={({map, maps}) => console.log(map, maps)}
                       yesIWantToUseGoogleMapApiInternals
 />
 ```

## Utility functions

####fitBounds (func)
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
####tile2LatLng (func)
####latLng2Tile (func)
####getTilesIds (func)

##Examples
* Placing react components on the map

[simple](http://istarkov.github.io/google-map-react/map/simple/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_simple/simple_map_page.jsx))

* Custom map options

[example](http://istarkov.github.io/google-map-react/map/options/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_options/options_map_page.jsx))

* Hover effects

[simple hover](http://istarkov.github.io/google-map-react/map/simple_hover/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_simple_hover/simple_hover_map_page.jsx))
  
[distance hover](http://istarkov.github.io/google-map-react/map/distance_hover/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_distance_hover/distance_hover_map_page.jsx))

* GoogleMap events

[example](http://istarkov.github.io/google-map-react/map/events/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_events/events_map_page.jsx))

* Example project

[main](http://istarkov.github.io/google-map-react/map/main/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_main/main_map_block.jsx))

[balderdash](http://istarkov.github.io/google-map-react/map/balderdash/)
(same source as main)

* All api examples

[google-map-react-examples](https://github.com/istarkov/google-map-react-examples)

## FAQs
### Rendering in a modal
If at the moment of GoogleMap control created, a modal has no size (width,height=0) or/and not displayed, the simple solution is to add something like this in render:

```jsx
render() {
  return this.props.modalIsOpen
    ? <GoogleMap />
    : null;
}
```

### Adding a searchbox

```javascript
mport React from 'react';

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
---
(*Really big thanks to [April Arcus](https://github.com/AprilArcus) for documentation fixes*)   
(*thank you [Dan Abramov](http://gaearon.github.io/react-dnd/) for titles structure*)   
(*great thanks to [Vladimir Akimov](https://github.com/b2whats) he knows why*)

## License
MIT (http://www.opensource.org/licenses/mit-license.php)   
