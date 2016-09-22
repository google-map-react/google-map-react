'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowEqual = require('fbjs/lib/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _omit = require('./utils/omit');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mainStyle = {
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  margin: 0,
  padding: 0,
  position: 'absolute'
};

var style = {
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  backgroundColor: 'transparent',
  position: 'absolute'
};

var GoogleMapMarkers = function (_Component) {
  _inherits(GoogleMapMarkers, _Component);

  function GoogleMapMarkers(props) {
    _classCallCheck(this, GoogleMapMarkers);

    var _this = _possibleConstructorReturn(this, (GoogleMapMarkers.__proto__ || Object.getPrototypeOf(GoogleMapMarkers)).call(this, props));

    _this._getState = function () {
      return {
        children: _this.props.dispatcher.getChildren(),
        updateCounter: _this.props.dispatcher.getUpdateCounter()
      };
    };

    _this._onChangeHandler = function () {
      if (!_this.dimesionsCache_) {
        return;
      }

      var prevChildCount = (_this.state.children || []).length;
      var state = _this._getState();

      _this.setState(state, function () {
        return (state.children || []).length !== prevChildCount && _this._onMouseChangeHandler();
      });
    };

    _this._onChildClick = function () {
      if (_this.props.onChildClick) {
        if (_this.hoverChildProps_) {
          var hoverKey = _this.hoverKey_;
          var childProps = _this.hoverChildProps_;
          // click works only on hovered item
          _this.props.onChildClick(hoverKey, childProps);
        }
      }
    };

    _this._onChildMouseDown = function () {
      if (_this.props.onChildMouseDown) {
        if (_this.hoverChildProps_) {
          var hoverKey = _this.hoverKey_;
          var childProps = _this.hoverChildProps_;
          // works only on hovered item
          _this.props.onChildMouseDown(hoverKey, childProps);
        }
      }
    };

    _this._onChildMouseEnter = function (hoverKey, childProps) {
      if (!_this.dimesionsCache_) {
        return;
      }

      if (_this.props.onChildMouseEnter) {
        _this.props.onChildMouseEnter(hoverKey, childProps);
      }

      _this.hoverChildProps_ = childProps;
      _this.hoverKey_ = hoverKey;
      _this.setState({ hoverKey: hoverKey });
    };

    _this._onChildMouseLeave = function () {
      if (!_this.dimesionsCache_) {
        return;
      }

      var hoverKey = _this.hoverKey_;
      var childProps = _this.hoverChildProps_;

      if (hoverKey !== undefined && hoverKey !== null) {
        if (_this.props.onChildMouseLeave) {
          _this.props.onChildMouseLeave(hoverKey, childProps);
        }

        _this.hoverKey_ = null;
        _this.hoverChildProps_ = null;
        _this.setState({ hoverKey: null });
      }
    };

    _this._onMouseAllow = function (value) {
      if (!value) {
        _this._onChildMouseLeave();
      }

      _this.allowMouse_ = value;
    };

    _this._onMouseChangeHandler = function () {
      if (_this.allowMouse_) {
        _this._onMouseChangeHandler_raf();
      }
    };

    _this._onMouseChangeHandler_raf = function () {
      // eslint-disable-line
      if (!_this.dimesionsCache_) {
        return;
      }

      var mp = _this.props.dispatcher.getMousePosition();

      if (mp) {
        (function () {
          var distances = [];
          var hoverDistance = _this.props.getHoverDistance();

          _react2.default.Children.forEach(_this.state.children, function (child, childIndex) {
            if (!child) return;
            // layers
            if (child.props.latLng === undefined && child.props.lat === undefined && child.props.lng === undefined) {
              return;
            }

            var childKey = child.key !== undefined && child.key !== null ? child.key : childIndex;
            var dist = _this.props.distanceToMouse(_this.dimesionsCache_[childKey], mp, child.props);
            if (dist < hoverDistance) {
              distances.push({
                key: childKey,
                dist: dist,
                props: child.props
              });
            }
          });

          if (distances.length) {
            distances.sort(function (a, b) {
              return a.dist - b.dist;
            });
            var hoverKey = distances[0].key;
            var childProps = distances[0].props;

            if (_this.hoverKey_ !== hoverKey) {
              _this._onChildMouseLeave();

              _this._onChildMouseEnter(hoverKey, childProps);
            }
          } else {
            _this._onChildMouseLeave();
          }
        })();
      } else {
        _this._onChildMouseLeave();
      }
    };

    _this._getDimensions = function (key) {
      var childKey = key;
      return _this.dimesionsCache_[childKey];
    };

    _this.props.dispatcher.on('kON_CHANGE', _this._onChangeHandler);
    _this.props.dispatcher.on('kON_MOUSE_POSITION_CHANGE', _this._onMouseChangeHandler);
    _this.props.dispatcher.on('kON_CLICK', _this._onChildClick);
    _this.props.dispatcher.on('kON_MDOWN', _this._onChildMouseDown);

    _this.dimesionsCache_ = {};
    _this.hoverKey_ = null;
    _this.hoverChildProps_ = null;
    _this.allowMouse_ = true;

    _this.state = _extends({}, _this._getState(), { hoverKey: null });
    return _this;
  }

  _createClass(GoogleMapMarkers, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.props.experimental === true) {
        return !(0, _shallowEqual2.default)(this.props, nextProps) || !(0, _shallowEqual2.default)((0, _omit2.default)(this.state, ['hoverKey']), (0, _omit2.default)(nextState, ['hoverKey']));
      }

      return !(0, _shallowEqual2.default)(this.props, nextProps) || !(0, _shallowEqual2.default)(this.state, nextState);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.dispatcher.removeListener('kON_CHANGE', this._onChangeHandler);
      this.props.dispatcher.removeListener('kON_MOUSE_POSITION_CHANGE', this._onMouseChangeHandler);
      this.props.dispatcher.removeListener('kON_CLICK', this._onChildClick);
      this.props.dispatcher.removeListener('kON_MDOWN', this._onChildMouseDown);

      this.dimesionsCache_ = null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var mainElementStyle = this.props.style || mainStyle;
      this.dimesionsCache_ = {};

      var markers = _react2.default.Children.map(this.state.children, function (child, childIndex) {
        if (!child) return undefined;
        if (child.props.latLng === undefined && child.props.lat === undefined && child.props.lng === undefined) {
          return _react2.default.cloneElement(child, {
            $geoService: _this2.props.geoService,
            $onMouseAllow: _this2._onMouseAllow,
            $prerender: _this2.props.prerender
          });
        }

        var latLng = child.props.latLng !== undefined ? child.props.latLng : { lat: child.props.lat, lng: child.props.lng };

        var pt = _this2.props.geoService.project(latLng, _this2.props.projectFromLeftTop);

        var stylePtPos = {
          left: pt.x,
          top: pt.y
        };

        var dx = 0;
        var dy = 0;

        if (!_this2.props.projectFromLeftTop) {
          // center projection
          if (_this2.props.geoService.hasSize()) {
            dx = _this2.props.geoService.getWidth() / 2;
            dy = _this2.props.geoService.getHeight() / 2;
          }
        }

        // to prevent rerender on child element i need to pass
        // const params $getDimensions and $dimensionKey instead of dimension object
        var childKey = child.key !== undefined && child.key !== null ? child.key : childIndex;

        _this2.dimesionsCache_[childKey] = _extends({
          x: pt.x + dx,
          y: pt.y + dy
        }, latLng);

        return _react2.default.createElement(
          'div',
          {
            key: childKey,
            style: _extends({}, style, stylePtPos),
            className: child.props.$markerHolderClassName
          },
          _react2.default.cloneElement(child, {
            $hover: childKey === _this2.state.hoverKey,
            $getDimensions: _this2._getDimensions,
            $dimensionKey: childKey,
            $geoService: _this2.props.geoService,
            $onMouseAllow: _this2._onMouseAllow,
            $prerender: _this2.props.prerender
          })
        );
      });

      return _react2.default.createElement(
        'div',
        { style: mainElementStyle },
        markers
      );
    }
  }]);

  return GoogleMapMarkers;
}(_react.Component);

GoogleMapMarkers.propTypes = {
  geoService: _react.PropTypes.any,
  style: _react.PropTypes.any,
  distanceToMouse: _react.PropTypes.func,
  dispatcher: _react.PropTypes.any,
  onChildClick: _react.PropTypes.func,
  onChildMouseDown: _react.PropTypes.func,
  onChildMouseLeave: _react.PropTypes.func,
  onChildMouseEnter: _react.PropTypes.func,
  getHoverDistance: _react.PropTypes.func,
  projectFromLeftTop: _react.PropTypes.bool,
  prerender: _react.PropTypes.bool
};
GoogleMapMarkers.defaultProps = {
  projectFromLeftTop: false,
  prerender: false
};
exports.default = GoogleMapMarkers;