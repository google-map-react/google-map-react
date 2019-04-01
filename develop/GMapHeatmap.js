import React from 'react';
import PropTypes from 'prop-types';
import {
  compose,
  defaultProps,
  withHandlers,
  withState,
  withContext,
  withProps,
  withPropsOnChange,
} from 'recompose';
import { createSelector } from 'reselect';

import {
  susolvkaCoords,
  generateMarkers,
  heatmapData,
  generateHeatmapData,
} from './data/fakeData';

import GoogleMapReact from '../src';
import SimpleMarker from './markers/SimpleMarker';

import ptInBounds from './utils/ptInBounds';
import withStateSelector from './utils/withStateSelector';
import { GOOGLE_API_KEY } from './config/Google_API_key';
import withSafeInterval from './utils/withSafeInterval';

export const gMapHeatmap = (
  {
    style,
    hoverDistance,
    options,
    heatmap,
    mapParams: { center, zoom },
    onChange,
    onChildMouseEnter,
    onChildMouseLeave,
    markers,
    draggable, // hoveredMarkerId,
  }
) => (
  <GoogleMapReact
    bootstrapURLKeys={{
      key: GOOGLE_API_KEY,
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
    heatmap={heatmap}
    heatmapLibrary
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
      margin: 10,
      padding: 10,
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
  withSafeInterval,
  withState('heatmap', 'setHeatmap', heatmapData),
  // describe events
  withHandlers({
    onChange: ({ setMapParams, setSafeInterval, setHeatmap, mapParams }) =>
      ({ center, zoom, bounds }) => {
        setMapParams({ center, zoom, bounds });
        const boundSetHeatmap = setHeatmap.bind(this);
        setSafeInterval(
          () => {
            boundSetHeatmap(
              generateHeatmapData(mapParams.center.lat, mapParams.center.lng)
            );
          },
          3000
        );
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

export default gMapHOC(gMapHeatmap);
