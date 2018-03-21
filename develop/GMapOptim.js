// Example to test the React Reconciler. This example
// is 100x faster in development mode,
// and 1.5-2x faster with NODE_ENV==='production'

// The idea was to not draw map children on hovers, but subscribe inside children on hover change
// see ./markers/ReactiveMarker source
import React from 'react';
import {
  compose,
  defaultProps,
  withHandlers,
  withState,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { createSelector } from 'reselect';

import { susolvkaCoords, generateMarkers } from './data/fakeData';

import GoogleMapReact from '../src';
// import SimpleMarker from './markers/SimpleMarker';
import ReactiveMarker from './markers/ReactiveMarker';

import ptInBounds from './utils/ptInBounds';
import props2Stream from './utils/props2Stream';
import withStateSelector from './utils/withStateSelector';

export const gMap = (
  {
    style,
    hoverDistance,
    options,
    mapParams: { center, zoom },
    onChange,
    onChildMouseEnter,
    onChildMouseLeave,
    markers,
    draggable,
  }
) => (
  <GoogleMapReact
    bootstrapURLKeys={{
      key: 'AIzaSyC-BebC7ChnHPzxQm7DAHYFMCqR5H3Jlps',
    }}
    style={style}
    options={options}
    draggable={draggable}
    hoverDistance={hoverDistance}
    zoom={zoom}
    center={center}
    onChange={onChange}
    onChildMouseEnter={onChildMouseEnter}
    onChildMouseLeave={onChildMouseLeave}
    experimental
  >
    {markers}
  </GoogleMapReact>
);

export const gMapHOC = compose(
  defaultProps({
    clusterRadius: 60,
    hoverDistance: 30,
    options: {
      minZoom: 3,
      maxZoom: 15,
    },
    style: {
      position: 'relative',
      margin: 0,
      padding: 0,
      flex: 1,
    },
  }),
  // withState so you could change markers if you want
  withStateSelector('markers', 'setMarkers', () =>
    createSelector(
      ({ route: { markersCount = 20 } }) => markersCount,
      markersCount => generateMarkers(markersCount)
    )),
  withState('hoveredMarkerId', 'setHoveredMarkerId', -1),
  withState('mapParams', 'setMapParams', { center: susolvkaCoords, zoom: 6 }),
  // describe events
  withHandlers({
    onChange: ({ setMapParams }) =>
      ({ center, zoom, bounds }) => {
        setMapParams({ center, zoom, bounds });
      },
    onChildMouseEnter: ({ setHoveredMarkerId }) =>
      (hoverKey, { id }) => {
        setHoveredMarkerId(id);
      },
    onChildMouseLeave: ({ setHoveredMarkerId }) =>
      () => {
        setHoveredMarkerId(-1);
      },
  }),
  withPropsOnChange(['markers', 'mapParams'], ({
    markers,
    mapParams: { bounds },
  }) => ({
    markers: bounds ? markers.filter(m => ptInBounds(bounds, m)) : [],
  })),
  withProps(({ hoveredMarkerId }) => ({
    draggable: hoveredMarkerId === -1,
  })),
  props2Stream('hoveredMarkerId'),
  withPropsOnChange(['markers', 'hoveredMarkerId$'], ({
    markers,
    hoveredMarkerId$,
  }) => ({
    markers: markers.map(({ ...markerProps, id }) => (
      <ReactiveMarker
        key={id}
        id={id}
        hoveredMarkerId$={hoveredMarkerId$}
        {...markerProps}
      />
    )),
  }))
);

export default gMapHOC(gMap);
