`google-map-react` is a component written over a small set of `google maps api`. It allows you to render any `react components` on the google map. It is fully isomorphic and can render on a server. Also it render map components in browser even if google map api is not loaded. (*you can disable javascript in browser dev tools, and reload any example page to view how it works*)   
It uses internal tweakable hover algorithm - every object on map can be hovered. 

It allows you to create interfaces like this [example](http://istarkov.github.io/google-map-react/map/main)    
(*You can scroll table, zoom - move map, hover-click on markers, click on table row*)

##Installation
```
npm install --save google-map-react
```

##What's It Look Like? 
At simple case you just need to add `lat` `lng` props to any child of `GoogleMap` component.   
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

###It works with your components.
Instead of ugly google map markers, balloons and other map components, just render on the map your cool animated react components.

###It isomorphic.
It renders on server. (*Welcome search engines*) (*you can disable javascript in browser dev tools, and reload any example page to view how it works*)

###Components positions calculated independent of `google maps api`.
It render components on the map before (and even without) `google maps api` loaded. 

###It loads google map api on demand.
There is no need to place `<script src=` tag at top of page. Google map api loads after first usage of `GoogleMap` component.

###It uses internal hover algorithm.
Now every object on map can be hovered. (*but you can still use css hover selectors if you want*).
Just zoom out here [example](http://istarkov.github.io/google-map-react/map/main) and you still will be able to hover on almost every map marker.   
Also this algorithm allows you to tweak hover probability of map objects, for example making some objects `more hoverable`.
[distance_hover example with different hover probabilities](http://istarkov.github.io/google-map-react/map/distance_hover)


##Issues
* Small icons jingle on Firefox (i don't see this in my older 'GoogleMap' version, so will find problem soon)


##Examples (api is really simple, just look into examples code)
* Simple example how to place react components on the map   
  [simple](http://istarkov.github.io/google-map-react/map/simple/)   
  [simple source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_simple/simple_map_page.jsx)   

* Hover api examples   
  [simple hover](http://istarkov.github.io/google-map-react/map/simple_hover/)   
  [simple hover source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_simple_hover/simple_hover_map_page.jsx)   

  [distance hover](http://istarkov.github.io/google-map-react/map/distance_hover/)   
  [distance hover source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_distance_hover/distance_hover_map_page.jsx)   

* GoogleMap events   
  [events](http://istarkov.github.io/google-map-react/map/events/)   
  [events source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_events/events_map_page.jsx)   

* All api examples   
  [main](http://istarkov.github.io/google-map-react/map/main/)   
  [main source](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/examples/x_main/main_map_block.jsx)   
    
  [balderdash](http://istarkov.github.io/google-map-react/map/balderdash/)   
  source same as main.

* Example project   
  [google-map-react-examples](https://github.com/istarkov/google-map-react-examples)

---

(*thank you [Dan Abramov](http://gaearon.github.io/react-dnd/) for titles structure*)   
(*great thanks to [Vladimir Akimov](https://github.com/b2whats) he knows why*)

#PS:
###Please help me to convert this `runglish readme` to `english readme`.
