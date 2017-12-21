import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import withContext from 'recompose/withContext';
import withProps from 'recompose/withProps';
import withPropsOnChange from 'recompose/withPropsOnChange';
import { createSelector } from 'reselect';
import ptInBounds from './utils/ptInBounds';
import SimpleMarker from './markers/SimpleMarker';
import withStateSelector from './utils/withStateSelector';
import GoogleMapReact from '../src';
import { susolvkaCoords, generateMarkers } from './data/fakeData';

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
    draggable, // hoveredMarkerId,
  }
) => (
  <GoogleMapReact
    draggable={draggable}
    style={style}
    options={options}
    hoverDistance={hoverDistance}
    center={center}
    zoom={zoom}
    onChange={onChange}
    onChildMouseEnter={onChildMouseEnter}
    onChildMouseLeave={onChildMouseLeave}
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
  withContext({ hello: PropTypes.string }, () => ({ hello: 'world' })),
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
  withPropsOnChange(['markers'], ({ markers }) => ({
    markers: markers.map(({ ...markerProps, id }) => (
      <SimpleMarker key={id} id={id} {...markerProps} />
    )),
  }))
);

export default gMapHOC(gMap);
