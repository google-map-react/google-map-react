import React from 'react';
import PropTypes from 'prop-types';
import { Motion } from 'react-motion';
import { compose, defaultProps, getContext } from 'recompose';

import { clusterMarkerHOC } from './ClusterMarker';

import simpleMarkerStyles from './SimpleMarker.sass';

export const simpleMarker = (
  {
    styles,
    hovered,
    $hover,
    defaultMotionStyle,
    motionStyle,
    // hello,
  } // console.log('hello', hello),
) => (
  <Motion defaultStyle={defaultMotionStyle} style={motionStyle}>
    {({ scale }) => (
      <div
        className={styles.marker}
        style={{
          transform: `translate3D(0,0,0) scale(${scale}, ${scale})`,
          zIndex: hovered || $hover ? 1 : 0,
        }}
      />
    )}
  </Motion>
);

export const simpleMarkerHOC = compose(
  defaultProps({
    styles: simpleMarkerStyles,
    initialScale: 0.6,
    defaultScale: 0.6,
    hoveredScale: 0.7,
  }),
  getContext({
    hello: PropTypes.string,
  }),
  // resuse HOC
  clusterMarkerHOC
);

export default simpleMarkerHOC(simpleMarker);
