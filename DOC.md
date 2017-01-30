# Documentation

Here I'll try to explain why some methods in google map react are needed and how to use them.

For all examples I'll use [recompose](github.com/acdlite/recompose)
and you must understand what `css-modules` is.

## Simple example.

[Simple example](http://www.webpackbin.com/N1N_45Owz)

At `Map.js` you will see the smallest possible boilerplate for GoogleMapReact component,

And a `MyMarker.js` is a simple React component.

Open `Log` tab at the top of `webpackbin` and see the `mapProps` log.
(_see the `withProps` at `Map.js`_)

First value is the { `center` and `zoom` } which is set by you,
and second value is the value provided by `GoogleMapReact` component at initialization,

```javascript
{
  center: { lat, lng }, // current map center
  zoom: 4, // current map zoom
  bounds: { nw, se, sw... }, // map corners in lat lng
  size: { width, height... } // map size in px
}
```

Component calls the `onChange` callback on initialization,
it's because `map bounds` can't be calculated without knowledge of map size.

Please move and zoom the map to see log changes.

Be sure that `onChange` callback is not called at realtime, and only at `idle` google map api callback.

It's because google api itself provides changes with some delay and to avoid synchronization issues
one of the ways was to use `idle` callback.

_NOTE: Now I think it was wrong decision to call onChange on initialization.
In the future releases
I'll deprecate such behavior and will provide helper to calculate size and bounds outside map control.
Now I think about heper similar to [AutoSizer](https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md)_

PS: I highly recommend you to use GoogleMapReact as a controllable component,
and always provide `center`, `zoom` and `onChange` props. (_see withState_)

## Whats wrong with "Simple example" above

The wrong part is that React components are placed on the map positioning from top, left corner.

In most cases it's not the expected behaviour, so we need to change the MyMarker position by changing
it's `position` and `left`, `top` css properties, or use `flex` as like as in this example.

[Good position](http://www.webpackbin.com/VJBKkj_vM)

Now `MyMarker` centered well, see the `myMarker.css` css changes and `MyMarker.js` layout change.

## To be continued
