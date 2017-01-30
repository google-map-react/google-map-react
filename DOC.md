# Documentation

Here I'll try to explain why some methods in google map react are needed and how to use them.

For all examples I'll use [recompose](github.com/acdlite/recompose)
and you must understand what `css-modules` is.

## Simple example.

[Simple example](http://www.webpackbin.com/N1N_45Owz)

At `Map.js` you will see the smallest possible boilerplate for GoogleMapReact component,

And a `MyMarker.js` is a simple React component.

I highly recommend you to use GoogleMapReact as a controllable component,
and always provide `center`, `zoom` and `onChange` props. (_see withState_)

## Whats wrong with "Simple example" above

The wrong part is that React components are placed on the map positioning from top, left corner.

In most cases it's not the expected behaviour, so we need to change the MyMarker position by changing
it's `position` and `left`, `top` css properties, or use `flex` as like as in this example.

[Good position](http://www.webpackbin.com/VJBKkj_vM)

Now `MyMarker` centered well, see the `myMarker.css` css changes and `MyMarker.js` layout change.

## To be continued
