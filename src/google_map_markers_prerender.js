import React, {PropTypes, Component} from 'react';
import GoogleMapMarkers from './google_map_markers.js';

const style = {
  width: '50%',
  height: '50%',
  left: '50%',
  top: '50%',
  // backgroundColor: 'red',
  margin: 0,
  padding: 0,
  position: 'absolute'
  // opacity: 0.3
};

export default class GoogleMapMarkersPrerender extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div style={style}>
        <GoogleMapMarkers {...this.props} />
      </div>
    );
  }
}
