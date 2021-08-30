# Google Map React &middot; [![npm version](https://badge.fury.io/js/google-map-react.svg)](http://badge.fury.io/js/google-map-react) [![Build Status](https://travis-ci.org/google-map-react/google-map-react.svg?branch=master)](https://travis-ci.org/google-map-react/google-map-react) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](github.com/google-map-react/google-map-react/CONTRIBUTING.md)

`google-map-react` is a component written over a small set of the [Google Maps API](https://developers.google.com/maps/). It allows you to render any React component on the Google Map. It is fully isomorphic and can render on a server. Additionally, it can render map components in the browser even if the Google Maps API is not loaded. It uses an internal, tweakable hover algorithm - every object on the map can be hovered.

It allows you to create interfaces like this [example](http://google-map-react.github.io/google-map-react/map/main) *(You can scroll the table, zoom/move the map, hover/click on markers, and click on table rows)*

The development of this package is sponsored by [Atlist](https://www.atlistmaps.com?c=google-map-react). Atlist is a no-code tool for creating custom maps with multiple markers.

## Getting started

In the simple case you just need to add `lat` and `lng` props to any child of `GoogleMapReact` component.

[See it in action at jsbin](https://jsbin.com/ruwogapuke/1/edit?js,output)

```javascript
import React from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap(){
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={59.955413}
          lng={30.337844}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}
```

### My map doesn't appear!

- Make sure the container element has width and height. The map will try to fill the parent container, but if the container has no size, the map will collapse to 0 width / height. This is not a requirement for google-map-react, [its a requirement for google-maps in general](https://developers.google.com/maps/documentation/javascript/tutorial).


## Installation

npm:
```
npm install --save google-map-react
```

yarn:
```
yarn add google-map-react
```

## Features

### Works with your Components

Instead of the default Google Maps markers, balloons and other map components, you can render your cool animated react components on the map.

### Isomorphic Rendering

It renders on the server. *(Welcome search engines)* *(you can disable javascript in browser dev tools, and reload any example page to see how it works)*

### Component Positions Calculated Independently of Google Maps API

It renders components on the map before (and even without) the Google Maps API loaded.

### Google Maps API Loads on Demand

There is no need to place a `<script src=` tag at top of page. The Google Maps API loads upon the first usage of the `GoogleMapReact` component.

### Use Google Maps API 

You can access to Google Maps `map` and `maps` objects by using `onGoogleApiLoaded`, in this case you will need to set `yesIWantToUseGoogleMapApiInternals` to `true`

```javascript
...

const handleApiLoaded = (map, maps) => {
  // use map and maps objects
};

...

<GoogleMapReact
  bootstrapURLKeys={{ key: /* YOUR KEY HERE */ }}
  defaultCenter={this.props.center}
  defaultZoom={this.props.zoom}
  yesIWantToUseGoogleMapApiInternals
  onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
>
  <AnyReactComponent
    lat={59.955413}
    lng={30.337844}
    text="My Marker"
  />
</GoogleMapReact>
```

PST: Remember to set `yesIWantToUseGoogleMapApiInternals` to true.

[Example here](https://github.com/google-map-react/google-map-react-examples/blob/master/src/examples/Main.js#L69)

### Internal Hover Algorithm

Now every object on the map can be hovered (however, you can still use css hover selectors if you want). If you try zooming out here [example](http://google-map-react.github.io/google-map-react/map/main), you will still be able to hover on almost every map marker.

## Examples

* Placing react components on the map:
[simple](http://google-map-react.github.io/google-map-react/map/simple/) ([source](https://github.com/google-map-react/old-examples/blob/master/web/flux/components/examples/x_simple/simple_map_page.jsx))

* Custom map options:
[example](http://google-map-react.github.io/google-map-react/map/options/) ([source](https://github.com/google-map-react/old-examples/blob/master/web/flux/components/examples/x_options/options_map_page.jsx))

* Hover effects:
[simple hover](http://google-map-react.github.io/google-map-react/map/simple_hover/) ([source](https://github.com/google-map-react/old-examples/blob/master/web/flux/components/examples/x_simple_hover/simple_hover_map_page.jsx));
[distance hover](http://google-map-react.github.io/google-map-react/map/distance_hover/) ([source](https://github.com/google-map-react/old-examples/blob/master/web/flux/components/examples/x_distance_hover/distance_hover_map_page.jsx))

* GoogleMap events:
[example](http://google-map-react.github.io/google-map-react/map/events/) ([source](https://github.com/google-map-react/old-examples/blob/master/web/flux/components/examples/x_events/events_map_page.jsx))

* Example project:
[main](http://google-map-react.github.io/google-map-react/map/main/) ([source](https://github.com/google-map-react/old-examples/blob/master/web/flux/components/examples/x_main/main_map_block.jsx)); [balderdash](http://google-map-react.github.io/google-map-react/map/balderdash/) (same source as main)

* Clustering example using Hooks (**new**: [source](https://github.com/leighhalliday/google-maps-clustering), [article](https://www.leighhalliday.com/google-maps-clustering)) [clustering-with-hooks](https://google-maps-clustering.netlify.com/)

* Clustering example ([source](https://github.com/istarkov/google-map-clustering-example))
[google-map-clustering-example](http://istarkov.github.io/google-map-clustering-example/)

* How to render thousands of markers (**new**: [source](https://github.com/istarkov/google-map-thousands-markers))
[google-map-thousands-markers](https://istarkov.github.io/google-map-thousands-markers/)

* Examples:
[Examples](https://github.com/google-map-react/google-map-react-examples)
[Old examples](https://github.com/google-map-react/old-examples)

* jsbin example
[jsbin example](https://jsbin.com/ruwogapuke/1/edit?js,output)

* webpackbin examples (**new**)
[docs with webpackbin examples](./DOC.md) (In progress)

* local develop example (new)
[develop example](./develop)

## Documentation

You can find the documentation here:

- [API Reference](./API.md)

- [NEW DOCS](./DOC.md) (In progress)

## Contribute

Local development is broken into two parts (ideally using two tabs).

First, run rollup to watch your `src/` module and automatically recompile it into `dist/` whenever you make changes.

```bash
npm start # runs rollup with watch flag
```

The second part will be running the `example/` create-react-app that's linked to the local version of your module.

```bash
# (in another tab)
cd example
npm start # runs create-react-app dev server
```

Now, anytime you make a change to your library in `src/` or to the example app's `example/src`, `create-react-app` will live-reload your local dev server so you can iterate on your component in real-time.

### Manual link-install
If you get the error `Module not found: Can't resolve 'google-react-map'...` while trying to run the example app, you need to manually link your local development module, try the following steps:
  1. In the root folder:
  ```bash
  npm link
  ```
  2. Go into `example/` and (after installing other dependencies) execute:
  ```bash
  npm link google-map-react
  ```

## License

[MIT](./LICENSE.md)

## Known Issues

* Older browsers (http://caniuse.com/#feat=promises) will need a ES6 Promise polyfill in order to work.

## !!! We are looking for contributors
We're actively looking for contributors, please send a message to the Owner or any of the Collaborators.
