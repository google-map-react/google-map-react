# Documentation

Here I'll try to explain why some methods in google map react are needed and how to use them.

For all examples I'll use [recompose](github.com/acdlite/recompose)
and you must understand what `css-modules` is.

_Looks like to rewrite current api I need to create Documentation about current version,
so it will be easier to detect wrong ideas and solutions_

## Simple example.

[Simple example](http://www.webpackbin.com/N1N_45Owz)

At `Map.js` you will see the smallest possible boilerplate for GoogleMapReact component,

And a `MyMarker.js` is a simple React component.

Open `Log` tab at the top of `webpackbin` and see the `mapProps` log.
(_see the `withProps` at `Map.js`_)

First value is the { `center` and `zoom` } which is set by you (_see withState at Map.js_),
and second value is the value provided by `GoogleMapReact` component at initialization in `onChange` callback.

```javascript
{
  center: { lat, lng }, // current map center
  zoom: 4, // current map zoom
  bounds: { nw, se, sw... }, // map corners in lat lng
  size: { width, height... } // map size in px
}
```

Calling `onChange` at initialization is needed because `map bounds` can't be calculated without knowledge of map size,
and bounds are really usefull in a lot of situations. (_see Note below_)

Please move and zoom the map to see log changes.

Be sure that `onChange` callback is not called at realtime, and only at `idle` google map api callback.

It's because google api itself provides changes with some delay and to avoid synchronization issues
one of the ways was to use `idle` callback.

On creation map uses the space of parent container and if parent container has zero height or width
the map will be not visible. (_This is one of the most common issue_)

If you want to place map inside `display: flex` container you need to pass `style` property
with `{ flex: 1 }` to the control as like as [here](https://github.com/istarkov/google-map-thousands-markers/blob/master/src/Map.js#L32)

By default map will not raise `onChange` event if parent size has changed, to change such behavior
add `resetBoundsOnResize = {true}` property.

_NOTE: Now I think it was wrong decision to call onChange at initialization.
In the future releases
I'll remove such behavior and will provide helper to calculate size and bounds outside map control.
I think about helper similar to [AutoSizer](https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md)
it also will allow to remove `resetBoundsOnResize`, `style` properties_

PS: I highly recommend you to use GoogleMapReact as a controllable component,
and always provide `center`, `zoom` and `onChange` props. (_see withState_)

_NOTE: In the future releases I'll remove usage of all `defaultProps` like `defaultCenter`_

## Whats wrong with "Simple example" above

The wrong part is that React components are placed on the map positioning from top, left corner.

In most cases it's not the expected behaviour, so we need to change the MyMarker position by changing
it's `position` and `left`, `top` css properties, or use `flex` as like as in this example.

[Good position](http://www.webpackbin.com/VJBKkj_vM)

Now `MyMarker` centered well, see the `myMarker.css` css changes and `MyMarker.js` layout change.

## Few markers with hover example.

[Few markers with hover example](http://www.webpackbin.com/Ny9EW1cwf)

As we use ordinary React components we can use any methods we use for hover effects like
- css
- onMouseEnter, onMouseLeave

But the problem you will see in example that markers are uniformly distributed over the map only in
designer pictures. In real life all that markers will be possibly in one place ;-)

And with ordinary hovers we have the problem, it's hard and sometimes impossible to hover on some markers.
So the solution is to use some algorithm for hovering.

(_Note: but I think there are a lot of cases exists there you can use ordinary hovers without any issues.
Yes, sometimes real life is like a magazine picture_)

## Few markers with hover example done right.

[Few markers with hover example done right](http://www.webpackbin.com/N1Cmhy5wf)

Now markers are hoverable even if placed under other marker.

Let's see what has changed,
- I've added four properties to map control `distanceToMouse`, `hoverDistance`, `onChildMouseEnter`, `onChildMouseLeave`
- Instead of using css hovers, I now pass `hover` property to marker directly.

So what does that properties means.

 - `distanceToMouse` you need to pass a distance function which will compute distance based on mouse position,
marker position, and any other properties you want.

It can be non euclidean distance based on some of your internals.
For example you can return a smaller distance for some markers making them more hoverable,
or to return infinite distance for other markers making them unhoverable.

For circle markers of equal radius it can be euclidean distance

```javascript
function distanceToMouse({ x, y }, { x: mouseX, y: mouseY }) {
  return Math.sqrt((x - mouseX) * (x - mouseX) + (y - mouseY) * (y - mouseY))
}
```

At the example above I use some kind of rectangular distance.

[Other distanceToMouse example](https://github.com/istarkov/google-map-react-examples/blob/dbfc2fcd381cc39da315875f5a45d4ebee765f26/web/flux/components/examples/x_distance_hover/distance_hover_map_page.jsx#L31-L46)


- `hoverDistance: number` distance threshold,
system can decide that marker is hovered only if `distanceToMouse` for that marker returns value less than this threshold.

- `onChildMouseEnter` - similar to `onMouseEnter` but here it's a callback called with `key` and `props` arguments for marker which have the smallest `distanceToMouse` value below `hoverDistance` threshold.

- `onChildMouseLeave` - similar to `onMouseLeave`.

Be sure that `onChildMouseEnter`, `onChildMouseLeave` and any other method starting with `onChild*` are useless without `hoverDistance` and `distanceToMouse` props.

And even now system uses some defaults for both `distanceToMouse` and `hoverDistance` it's not a good idea to use them for your app.

Other `onChild*` methods `onChildClick`, `onChildMouseDown`, `onChildMouseUp`, `onChildMouseMove`.

(_`onChildMouseDown`, `onChildMouseUp`, `onChildMouseMove` are usefull for creating draggable markers,
to prevent map from moving when you drag something over, you can set `draggable` map property to false
_)

(_Note: defaults for `distanceToMouse` and `hoverDistance` will be removed in future releases_)


## To be continued
