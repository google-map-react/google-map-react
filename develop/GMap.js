import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
// import withPropsOnChange from 'recompose/withPropsOnChange';
import GoogleMapReact from '../src';
import SimpleMarker from './markers/SimpleMarker';

import { susolvkaCoords, markersData } from './data/fakeData';

export const gMap = ({
  style, hoverDistance, options,
  mapParams: { center, zoom },
  onChange, onChildMouseEnter, onChildMouseLeave,
  markers, hoveredMarkerId,
}) => (
  <GoogleMapReact
    style={style}
    options={options}
    hoverDistance={hoverDistance}
    center={center}
    zoom={zoom}
    onChange={onChange}
    onChildMouseEnter={onChildMouseEnter}
    onChildMouseLeave={onChildMouseLeave}
  >
    {
      markers
        .map(({ ...markerProps, id }) => (
          <SimpleMarker
            key={id}
            hovered={id === hoveredMarkerId}
            {...markerProps}
          />
        ))
    }
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
  withState('markers', 'setMarkers', markersData),
  withState('hoveredMarkerId', 'setHoveredMarkerId', -1),
  withState('mapParams', 'setMapParams', { center: susolvkaCoords, zoom: 10 }),
  // describe events
  withHandlers({
    onChange: ({ setMapParams }) => ({ center, zoom, bounds }) => {
      setMapParams({ center, zoom, bounds });
    },
    onChildMouseEnter: ({ setHoveredMarkerId }) => (hoverKey, { id }) => {
      setHoveredMarkerId(id);
    },
    onChildMouseLeave: ({ setHoveredMarkerId }) => () => {
      setHoveredMarkerId(-1);
    },
  }),
);

export default gMapHOC(gMap);
