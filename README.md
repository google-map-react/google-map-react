`google-map-react` is a component written over a small set of the [Google Maps API](https://developers.google.com/maps/). It allows you to render any React component on the Google Map. It is fully isomorphic and can render on a server. Additionally, it can render map components in the browser even if the Google Maps API is not loaded. It uses an internal, tweakable hover algorithm - every object on the map can be hovered. 

It allows you to create interfaces like this [example](http://istarkov.github.io/google-map-react/map/main) *(You can scroll the table, zoom/move the map, hover/click on markers, and click on table rows)*

##Installation
```
npm install --save google-map-react
```

##What's it Look Like? 
In the simple case you just need to add `lat` `lng` props to any child of `GoogleMap` component.   
[simple example in action](http://istarkov.github.io/google-map-react/map/simple)   
```javascript
import React, {PropTypes, Component} from 'react/addons';
import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';
import MyGreatPlace from './my_great_place.jsx';

export default class SimpleMapPage extends Component {
  static defaultProps = {
    center: [59.938043, 30.337157],
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
        center={this.props.center}
        zoom={this.props.zoom}>
        <MyGreatPlace lat={59.955413} lng={30.337844} text={'A'} /* Kreyser Avrora */ />
        <MyGreatPlace {...this.props.greatPlaceCoords} text={'B'} /* road circle */ />
      </GoogleMap>
    );
  }
}
```

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
* Small icons jingle on Firefox (I don't see this in my older 'GoogleMap' version, so I will find the problem soon)


##Examples (API is really simple, just look at the examples)
* Placing react components on the map   
  [simple](http://istarkov.github.io/google-map-react/map/simple/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_simple/simple_map_page.jsx))

* Hover effects   
  [simple hover](http://istarkov.github.io/google-map-react/map/simple_hover/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_simple_hover/simple_hover_map_page.jsx))   
  [distance hover](http://istarkov.github.io/google-map-react/map/distance_hover/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_distance_hover/distance_hover_map_page.jsx))

* GoogleMap events   
  [events](http://istarkov.github.io/google-map-react/map/events/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_events/events_map_page.jsx))

* All api examples   
  [main](http://istarkov.github.io/google-map-react/map/main/) ([source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_main/main_map_block.jsx))   
  [balderdash](http://istarkov.github.io/google-map-react/map/balderdash/) (same source as main)

* Example project   
  [google-map-react-examples](https://github.com/istarkov/google-map-react-examples)

---

(*thank you [Dan Abramov](http://gaearon.github.io/react-dnd/) for titles structure*)   
(*great thanks to [Vladimir Akimov](https://github.com/b2whats) he knows why*)
