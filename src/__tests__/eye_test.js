// "eye test" (c)somebody - means check output by your eyes :-)
// TODO read how to test react components

import React, {PropTypes, Component} from 'react';
import GoogleMap from '../google_map.js';

export default class SimpleTest extends Component {
  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    greatPlaceCoords: PropTypes.any
  };

  static defaultProps = {
    center: [59.938043, 30.337157],
    zoom: 9,
    greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
       <GoogleMap
        center={this.props.center}
        zoom={this.props.zoom}>
        <div lat={59.955413} lng={30.337844}>----------I-PROMISE-TO---------------</div>
        <div {...this.props.greatPlaceCoords}>-------WRITE-SOME-TESTS-------------</div>
      </GoogleMap>
    );
  }
}

const html = React.renderToString(<SimpleTest />);
console.log(html); // eslint-disable-line no-console
