import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withPropsOnChange from 'recompose/withPropsOnChange';
import pure from 'recompose/pure';
import { Motion, spring } from 'react-motion';
import clusterMarkerStyles from './ClusterMarker.sass';

export const clusterMarker = ({
  styles, text, hovered, $hover,
  defaultMotionStyle, motionStyle,
}) => (
  <Motion
    defaultStyle={defaultMotionStyle}
    style={motionStyle}
  >
  {
    ({ scale }) => (
      <div
        className={styles.marker}
        style={{
          transform: `translate3D(0,0,0) scale(${scale}, ${scale})`,
          zIndex: (hovered || $hover) ? 1 : 0,
        }}
      >
        <div
          className={styles.text}
        >
          {text}
        </div>
      </div>
    )
  }
  </Motion>
);

export const clusterMarkerHOC = compose(
  defaultProps({
    text: '0',
    styles: clusterMarkerStyles,
    initialScale: 0.6,
    defaultScale: 1,
    hoveredScale: 1.15,
    hovered: false,
    stiffness: 320,
    damping: 7,
    precision: 0.001,
  }),
  // pure optimization can cause some effects you don't want,
  // don't use it in development for markers
  pure,
  withPropsOnChange(
    ['initialScale'],
    ({ initialScale, defaultScale, $prerender }) => ({
      initialScale,
      defaultMotionStyle: { scale: $prerender ? defaultScale : initialScale },
    })
  ),
  withPropsOnChange(
    ['hovered', '$hover'],
    ({
      hovered, $hover, hoveredScale, defaultScale,
      stiffness, damping, precision,
    }) => ({
      $hover,
      hovered,
      motionStyle: {
        scale: spring(
          (hovered || $hover) ? hoveredScale : defaultScale,
          { stiffness, damping, precision }
        ),
      },
    })
  )
);

export default clusterMarkerHOC(clusterMarker);
