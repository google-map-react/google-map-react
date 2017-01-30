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

* Older browsers (http://caniuse.com/#feat=promises) will need a ES6 Promise polyfill in order to work.

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

* Clustering example (new)
[google-map-clustering-example](http://istarkov.github.io/google-map-clustering-example/)

* How to render thousands of markers (new)
[google-map-thousands-markers](https://istarkov.github.io/google-map-thousands-markers/)

* All api examples:
[google-map-react-examples](https://github.com/istarkov/google-map-react-examples)

* jsbin example
[jsbin example](https://jsbin.com/roqutisoqu/1/edit?js,console,output)

* local develop example (new)
[develop example](./develop)

## Contribute

To get a reloadable env, with map, clone this project and

```shell
npm install
npm run start
# open browser at localhost:4000
```

## API

[API](./API.md)

[NEW DOCS](./DOC.md)


## Thank you

(*Really big thanks to [April Arcus](https://github.com/AprilArcus) for documentation fixes*)

(*thank you [Dan Abramov](http://gaearon.github.io/react-dnd/) for titles structure*)

(*great thanks to [Vladimir Akimov](https://github.com/b2whats) he knows why*)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
