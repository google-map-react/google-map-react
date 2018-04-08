import React, { Component, PropTypes } from 'react';
import TransitionGroup from 'react-addons-transition-group';

export default class TransitionGroupMarker extends Component {
  render() {
    return (
      <TransitionGroup>
        {React.Children.map(this.props.children, child => {
          return React.cloneElement(child, {
            $hover: this.props.$hover,
          });
        })}
      </TransitionGroup>
    );
  }
}
