import React, {Component} from 'react';

const style = {
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  margin: 0,
  padding: 0,
  position: 'absolute',
};

export default class GoogleMapMap extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return false; // disable react on this div
  }

  render() {
    return (
      <div style={style} />
    );
  }
}
