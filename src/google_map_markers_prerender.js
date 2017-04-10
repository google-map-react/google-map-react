import React from 'react';
import GoogleMapMarkers from './google_map_markers';

const style = {
  width: '50%',
  height: '50%',
  left: '50%',
  top: '50%',
  // backgroundColor: 'red',
  margin: 0,
  padding: 0,
  position: 'absolute',
  // opacity: 0.3
};

export default function(props) {
  return (
    <div style={style}>
      <GoogleMapMarkers {...props} prerender />
    </div>
  );
}
