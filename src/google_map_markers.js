import React, {PropTypes, Component} from 'react';

import shouldPureComponentUpdate from 'react-pure-render/function';

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
  static propTypes = {
    geoService: PropTypes.any,
    style: PropTypes.any,
    distanceToMouse: PropTypes.func,
    dispatcher: PropTypes.any,
    onChildClick: PropTypes.func,
    onChildMouseLeave: PropTypes.func,
    onChildMouseEnter: PropTypes.func,
    hoverDistance: PropTypes.number,
    projectFromLeftTop: PropTypes.bool,
  };

  static defaultProps = {
    projectFromLeftTop: false,
  };

  constructor(props) {
    super(props);
    this.props.dispatcher.on('kON_CHANGE', this._onChangeHandler);
    this.props.dispatcher.on('kON_MOUSE_POSITION_CHANGE', this._onMouseChangeHandler);
    this.props.dispatcher.on('kON_CLICK', this._onChildClick);

    this.dimesionsCache_ = {};
    this.hoverKey_ = null;
    this.hoverChildProps_ = null;
    this.allowMouse_ = true;

    this.state = {...this._getState(), hoverKey: null};
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentWillUnmount() {
    this.props.dispatcher.removeListener('kON_CHANGE', this._onChangeHandler);
    this.props.dispatcher.removeListener('kON_MOUSE_POSITION_CHANGE', this._onMouseChangeHandler);
    this.props.dispatcher.removeListener('kON_CLICK', this._onChildClick);

    this.dimesionsCache_ = null;
  }

  _getState = () => {
    return {
      children: this.props.dispatcher.getChildren(),
      updateCounter: this.props.dispatcher.getUpdateCounter(),
    };
  }

  _onChangeHandler = () => {
    if (!this.dimesionsCache_) {
      return;
    }

    const state = this._getState();
    this.setState(state);
  }

  _onChildClick = () => {
    if (this.props.onChildClick) {
      if (this.hoverChildProps_) {
        const hoverKey = this.hoverKey_;
        const childProps = this.hoverChildProps_;
        // click works only on hovered item
        this.props.onChildClick(hoverKey, childProps);
      }
    }
  }

  _onChildMouseEnter = (hoverKey, childProps) => {
    if (!this.dimesionsCache_) {
      return;
    }

    if (this.props.onChildMouseEnter) {
      this.props.onChildMouseEnter(hoverKey, childProps);
    }

    this.hoverChildProps_ = childProps;
    this.hoverKey_ = hoverKey;
    this.setState({hoverKey: hoverKey});
  }

  _onChildMouseLeave = () => {
    if (!this.dimesionsCache_) {
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
      this.setState({hoverKey: null});
    }
  }


  _onMouseAllow = (value) => {
    if (!value) {
      this._onChildMouseLeave();
    }

    this.allowMouse_ = value;
  }


  _onMouseChangeHandler = () => {
    if (this.allowMouse_) {
      this._onMouseChangeHandler_raf();
    }
  }

  _onMouseChangeHandler_raf = () => {
    if (!this.dimesionsCache_) {
      return;
    }

    const mp = this.props.dispatcher.getMousePosition();

    if (mp) {
      const distances = [];

      React.Children.forEach(this.state.children, (child, childIndex) => {
        const childKey = child.key !== undefined && child.key !== null ? child.key : childIndex;
        const dist = this.props.distanceToMouse(this.dimesionsCache_[childKey], mp, child.props);
        if (dist < this.props.hoverDistance) {
          distances.push(
            {
              key: childKey,
              dist: dist,
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
  }

  _getDimensions = (key) => {
    const childKey = key;
    return this.dimesionsCache_[childKey];
  }

  render() {
    const mainElementStyle = this.props.style || mainStyle;

    this.dimesionsCache_ = {};

    const markers = React.Children.map(this.state.children, (child, childIndex) => {
      const pt = this.props.geoService.project({
        lat: child.props.lat,
        lng: child.props.lng,
      }, this.props.projectFromLeftTop);

      const stylePtPos = {
        left: pt.x,
        top: pt.y,
      };

      let dx = 0;
      let dy = 0;

      if (!this.props.projectFromLeftTop) { // center projection
        if (this.props.geoService.hasSize()) {
          dx = this.props.geoService.getWidth() / 2;
          dy = this.props.geoService.getHeight() / 2;
        }
      }

      // to prevent rerender on child element i need to pass
      // const params $getDimensions and $dimensionKey instead of dimension object
      const childKey = child.key !== undefined && child.key !== null ? child.key : childIndex;
      this.dimesionsCache_[childKey] = {
        x: pt.x + dx,
        y: pt.y + dy,
        lat: child.props.lat,
        lng: child.props.lng,
      };

      return (
        <div key={childKey} style={{...style, ...stylePtPos}}>
          {React.cloneElement(child, {
            $hover: childKey === this.state.hoverKey,
            $getDimensions: this._getDimensions,
            $dimensionKey: childKey,
            $geoService: this.props.geoService,
            $onMouseAllow: this._onMouseAllow,
          })}
        </div>
      );
    });

    return (
      <div style={mainElementStyle}>
        {markers}
      </div>
    );
  }
}
