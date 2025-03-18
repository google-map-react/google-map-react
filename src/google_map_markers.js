import React, { Component } from 'react';
import PropTypes from 'prop-types';

// utils
import omit from './utils/omit';
import shallowEqual from './utils/shallowEqual';

const mainStyle = {
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  margin: 0,
  padding: 0,
  position: 'absolute',
};

const style = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  backgroundColor: 'transparent',
  position: 'absolute',
};

export default class GoogleMapMarkers extends Component {
  /* eslint-disable react/forbid-prop-types */
  static propTypes = {
    geoService: PropTypes.any,
    style: PropTypes.any,
    distanceToMouse: PropTypes.func,
    dispatcher: PropTypes.any,
    onChildClick: PropTypes.func,
    onChildMouseDown: PropTypes.func,
    onChildMouseLeave: PropTypes.func,
    onChildMouseEnter: PropTypes.func,
    getHoverDistance: PropTypes.func,
    insideMapPanes: PropTypes.bool,
    prerender: PropTypes.bool,
  };
  /* eslint-enable react/forbid-prop-types */

  static defaultProps = {
    insideMapPanes: false,
    prerender: false,
  };

  constructor(props) {
    super(props);

    this.dimensionsCache_ = {};
    this.hoverKey_ = null;
    this.hoverChildProps_ = null;
    this.allowMouse_ = true;

    this.state = { ...this._getState(), hoverKey: null };
  }

  componentDidMount() {
    this.props.dispatcher.on('kON_CHANGE', this._onChangeHandler);
    this.props.dispatcher.on(
      'kON_MOUSE_POSITION_CHANGE',
      this._onMouseChangeHandler
    );
    this.props.dispatcher.on('kON_CLICK', this._onChildClick);
    this.props.dispatcher.on('kON_MDOWN', this._onChildMouseDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.experimental === true) {
      return (
        !shallowEqual(this.props, nextProps) ||
        !shallowEqual(
          omit(this.state, ['hoverKey']),
          omit(nextState, ['hoverKey'])
        )
      );
    }

    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  componentWillUnmount() {
    this.props.dispatcher.removeListener('kON_CHANGE', this._onChangeHandler);
    this.props.dispatcher.removeListener(
      'kON_MOUSE_POSITION_CHANGE',
      this._onMouseChangeHandler
    );
    this.props.dispatcher.removeListener('kON_CLICK', this._onChildClick);
    this.props.dispatcher.removeListener('kON_MDOWN', this._onChildMouseDown);

    this.dimensionsCache_ = null;
  }

  _getState = () => ({
    children: this.props.dispatcher.getChildren(),
    updateCounter: this.props.dispatcher.getUpdateCounter(),
  });

  _onChangeHandler = () => {
    if (!this.dimensionsCache_) {
      return;
    }

    const prevChildCount = (this.state.children || []).length;
    const state = this._getState();

    this.setState(
      state,
      () =>
        (state.children || []).length !== prevChildCount &&
        this._onMouseChangeHandler()
    );
  };

  _onChildClick = () => {
    if (this.props.onChildClick) {
      if (this.hoverChildProps_) {
        const hoverKey = this.hoverKey_;
        const childProps = this.hoverChildProps_;
        // click works only on hovered item
        this.props.onChildClick(hoverKey, childProps);
      }
    }
  };

  _onChildMouseDown = () => {
    if (this.props.onChildMouseDown) {
      if (this.hoverChildProps_) {
        const hoverKey = this.hoverKey_;
        const childProps = this.hoverChildProps_;
        // works only on hovered item
        this.props.onChildMouseDown(hoverKey, childProps);
      }
    }
  };

  _onChildMouseEnter = (hoverKey, childProps) => {
    if (!this.dimensionsCache_) {
      return;
    }

    if (this.props.onChildMouseEnter) {
      this.props.onChildMouseEnter(hoverKey, childProps);
    }

    this.hoverChildProps_ = childProps;
    this.hoverKey_ = hoverKey;
    this.setState({ hoverKey });
  };

  _onChildMouseLeave = () => {
    if (!this.dimensionsCache_) {
      return;
    }

    const hoverKey = this.hoverKey_;
    const childProps = this.hoverChildProps_;

    if (hoverKey !== undefined && hoverKey !== null) {
      if (this.props.onChildMouseLeave) {
        this.props.onChildMouseLeave(hoverKey, childProps);
      }

      this.hoverKey_ = null;
      this.hoverChildProps_ = null;
      this.setState({ hoverKey: null });
    }
  };

  _onMouseAllow = (value) => {
    if (!value) {
      this._onChildMouseLeave();
    }

    this.allowMouse_ = value;
  };

  _onMouseChangeHandler = () => {
    if (this.allowMouse_) {
      this._onMouseChangeHandlerRaf();
    }
  };

  _onMouseChangeHandlerRaf = () => {
    if (!this.dimensionsCache_) {
      return;
    }

    const mp = this.props.dispatcher.getMousePosition();

    if (mp) {
      const distances = [];
      const hoverDistance = this.props.getHoverDistance();

      React.Children.forEach(this.state.children, (child, childIndex) => {
        if (!child) return;
        // layers
        if (
          child.props.latLng === undefined &&
          child.props.lat === undefined &&
          child.props.lng === undefined
        ) {
          return;
        }

        const childKey =
          child.key !== undefined && child.key !== null
            ? child.key
            : childIndex;
        const dist = this.props.distanceToMouse(
          this.dimensionsCache_[childKey],
          mp,
          child.props
        );
        if (dist < hoverDistance) {
          distances.push({
            key: childKey,
            dist,
            props: child.props,
          });
        }
      });

      if (distances.length) {
        distances.sort((a, b) => a.dist - b.dist);
        const hoverKey = distances[0].key;
        const childProps = distances[0].props;

        if (this.hoverKey_ !== hoverKey) {
          this._onChildMouseLeave();

          this._onChildMouseEnter(hoverKey, childProps);
        }
      } else {
        this._onChildMouseLeave();
      }
    } else {
      this._onChildMouseLeave();
    }
  };

  _getDimensions = (key) => {
    const childKey = key;
    return this.dimensionsCache_[childKey];
  };

  render() {
    const mainElementStyle = this.props.style || mainStyle;
    this.dimensionsCache_ = {};

    const markers = React.Children.map(
      this.state.children,
      (child, childIndex) => {
        if (!child) return undefined;
        if (
          child.props.latLng === undefined &&
          child.props.lat === undefined &&
          child.props.lng === undefined
        ) {
          return React.cloneElement(child, {
            $geoService: this.props.geoService,
            $onMouseAllow: this._onMouseAllow,
            $prerender: this.props.prerender,
          });
        }

        const latLng =
          child.props.latLng !== undefined
            ? child.props.latLng
            : { lat: child.props.lat, lng: child.props.lng };

        const pt = this.props.insideMapPanes
          ? this.props.geoService.fromLatLngToDivPixel(latLng)
          : this.props.geoService.fromLatLngToCenterPixel(latLng);

        const stylePtPos = {
          left: pt.x,
          top: pt.y,
        };

        // If the component has a southeast corner defined (either as a LatLng, or a separate
        // lat and lng pair), set the width and height based on the distance between the northwest
        // and the southeast corner to lock the overlay to the correct geographic bounds.
        if (
          child.props.seLatLng !== undefined ||
          (child.props.seLat !== undefined && child.props.seLng !== undefined)
        ) {
          const seLatLng =
            child.props.seLatLng !== undefined
              ? child.props.seLatLng
              : { lat: child.props.seLat, lng: child.props.seLng };

          const sePt = this.props.insideMapPanes
            ? this.props.geoService.fromLatLngToDivPixel(seLatLng)
            : this.props.geoService.fromLatLngToCenterPixel(seLatLng);

          stylePtPos.width = sePt.x - pt.x;
          stylePtPos.height = sePt.y - pt.y;
        }

        const containerPt = this.props.geoService.fromLatLngToContainerPixel(
          latLng
        );

        // to prevent rerender on child element i need to pass
        // const params $getDimensions and $dimensionKey instead of dimension object
        const childKey =
          child.key !== undefined && child.key !== null
            ? child.key
            : childIndex;

        this.dimensionsCache_[childKey] = {
          x: containerPt.x,
          y: containerPt.y,
          ...latLng,
        };

        if (child.props.markerPosition) {
          const markerPosition = child.props.markerPosition;
          if (typeof markerPosition === 'string') {
            const [left, top] = markerPosition.split(' ');
            if (left && top) {
              this.markerPosition = { transform: `translate(${left},${top})` };
            } else {
              console.warn(
                `markerPosition expects a two values separated by a single whitespace`
              );
            }
          } else {
            console.error(
              `markerPosition expects a value of type string, got ${typeof markerPosition} instead.`
            );
          }
        }

        return (
          <div
            key={childKey}
            style={{ ...style, ...stylePtPos }}
            className={child.props.$markerHolderClassName}
          >
            <div
              style={{
                ...style,
                ...this.markerPosition,
                width: undefined,
                height: undefined,
              }}
            >
              {React.cloneElement(child, {
                $hover: childKey === this.state.hoverKey,
                $getDimensions: this._getDimensions,
                $dimensionKey: childKey,
                $geoService: this.props.geoService,
                $onMouseAllow: this._onMouseAllow,
                $prerender: this.props.prerender,
              })}
            </div>
          </div>
        );
      }
    );

    return <div style={mainElementStyle}>{markers}</div>;
  }
}
