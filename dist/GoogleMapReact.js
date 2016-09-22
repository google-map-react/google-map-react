(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["GoogleMapReact"] = factory(require("react"), require("react-dom"));
	else
		root["GoogleMapReact"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_25__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _google_map = __webpack_require__(8);

	var _google_map2 = _interopRequireDefault(_google_map);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _google_map2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _shallowEqual = __webpack_require__(6);

	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

	var _omit = __webpack_require__(5);

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _wrap2 = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LatLng = function () {
	  function LatLng(lat, lng) {
	    _classCallCheck(this, LatLng);

	    if (isNaN(lat) || isNaN(lng)) {
	      throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	    }
	    this.lat = +lat;
	    this.lng = +lng;
	  }

	  _createClass(LatLng, [{
	    key: 'wrap',
	    value: function wrap() {
	      return new LatLng(this.lat, (0, _wrap2.wrap)(this.lng, -180, 180));
	    }
	  }]);

	  return LatLng;
	}();

	LatLng.convert = function (a) {
	  if (a instanceof LatLng) {
	    return a;
	  }

	  if (Array.isArray(a)) {
	    return new LatLng(a[0], a[1]);
	  }

	  if ('lng' in a && 'lat' in a) {
	    return new LatLng(a.lat, a.lng);
	  }

	  return a;
	};

	exports.default = LatLng;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.wrap = wrap;
	function wrap(n, min, max) {
	  var d = max - min;
	  return n === max ? n : ((n - min) % d + d) % d + min;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	// https://github.com/acdlite/recompose/blob/master/src/packages/recompose/utils/omit.js
	var omit = function omit(obj, keys) {
	  var rest = _objectWithoutProperties(obj, []);

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (rest.hasOwnProperty(key)) {
	      delete rest[key];
	    }
	  }
	  return rest;
	};

	exports.default = omit;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks
	 * 
	 */

	/*eslint-disable no-self-compare */

	'use strict';

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/**
	 * inlined Object.is polyfill to avoid requiring consumers ship their own
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	 */
	function is(x, y) {
	  // SameValue algorithm
	  if (x === y) {
	    // Steps 1-5, 7-10
	    // Steps 6.b-6.e: +0 != -0
	    return x !== 0 || 1 / x === 1 / y;
	  } else {
	    // Step 6.a: NaN == NaN
	    return x !== x && y !== y;
	  }
	}

	/**
	 * Performs equality by iterating through keys on an object and returning false
	 * when any key has values which are not strictly equal between the arguments.
	 * Returns true when the values of all keys are strictly equal.
	 */
	function shallowEqual(objA, objB) {
	  if (is(objA, objB)) {
	    return true;
	  }

	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);

	  if (keysA.length !== keysB.length) {
	    return false;
	  }

	  // Test for A's keys different from B.
	  for (var i = 0; i < keysA.length; i++) {
	    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
	      return false;
	    }
	  }

	  return true;
	}

	module.exports = shallowEqual;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	module.exports = Point;

	function Point(x, y) {
	    this.x = x;
	    this.y = y;
	}

	Point.prototype = {
	    clone: function() { return new Point(this.x, this.y); },

	    add:     function(p) { return this.clone()._add(p);     },
	    sub:     function(p) { return this.clone()._sub(p);     },
	    mult:    function(k) { return this.clone()._mult(k);    },
	    div:     function(k) { return this.clone()._div(k);     },
	    rotate:  function(a) { return this.clone()._rotate(a);  },
	    matMult: function(m) { return this.clone()._matMult(m); },
	    unit:    function() { return this.clone()._unit(); },
	    perp:    function() { return this.clone()._perp(); },
	    round:   function() { return this.clone()._round(); },

	    mag: function() {
	        return Math.sqrt(this.x * this.x + this.y * this.y);
	    },

	    equals: function(p) {
	        return this.x === p.x &&
	               this.y === p.y;
	    },

	    dist: function(p) {
	        return Math.sqrt(this.distSqr(p));
	    },

	    distSqr: function(p) {
	        var dx = p.x - this.x,
	            dy = p.y - this.y;
	        return dx * dx + dy * dy;
	    },

	    angle: function() {
	        return Math.atan2(this.y, this.x);
	    },

	    angleTo: function(b) {
	        return Math.atan2(this.y - b.y, this.x - b.x);
	    },

	    angleWith: function(b) {
	        return this.angleWithSep(b.x, b.y);
	    },

	    // Find the angle of the two vectors, solving the formula for the cross product a x b = |a||b|sin(θ) for θ.
	    angleWithSep: function(x, y) {
	        return Math.atan2(
	            this.x * y - this.y * x,
	            this.x * x + this.y * y);
	    },

	    _matMult: function(m) {
	        var x = m[0] * this.x + m[1] * this.y,
	            y = m[2] * this.x + m[3] * this.y;
	        this.x = x;
	        this.y = y;
	        return this;
	    },

	    _add: function(p) {
	        this.x += p.x;
	        this.y += p.y;
	        return this;
	    },

	    _sub: function(p) {
	        this.x -= p.x;
	        this.y -= p.y;
	        return this;
	    },

	    _mult: function(k) {
	        this.x *= k;
	        this.y *= k;
	        return this;
	    },

	    _div: function(k) {
	        this.x /= k;
	        this.y /= k;
	        return this;
	    },

	    _unit: function() {
	        this._div(this.mag());
	        return this;
	    },

	    _perp: function() {
	        var y = this.y;
	        this.y = this.x;
	        this.x = -y;
	        return this;
	    },

	    _rotate: function(angle) {
	        var cos = Math.cos(angle),
	            sin = Math.sin(angle),
	            x = cos * this.x - sin * this.y,
	            y = sin * this.x + cos * this.y;
	        this.x = x;
	        this.y = y;
	        return this;
	    },

	    _round: function() {
	        this.x = Math.round(this.x);
	        this.y = Math.round(this.y);
	        return this;
	    }
	};

	// constructs Point from an array if necessary
	Point.convert = function (a) {
	    if (a instanceof Point) {
	        return a;
	    }
	    if (Array.isArray(a)) {
	        return new Point(a[0], a[1]);
	    }
	    return a;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(25);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _shallowEqual = __webpack_require__(6);

	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

	var _marker_dispatcher = __webpack_require__(11);

	var _marker_dispatcher2 = _interopRequireDefault(_marker_dispatcher);

	var _google_map_map = __webpack_require__(9);

	var _google_map_map2 = _interopRequireDefault(_google_map_map);

	var _google_map_markers = __webpack_require__(2);

	var _google_map_markers2 = _interopRequireDefault(_google_map_markers);

	var _google_map_markers_prerender = __webpack_require__(10);

	var _google_map_markers_prerender2 = _interopRequireDefault(_google_map_markers_prerender);

	var _google_map_loader = __webpack_require__(19);

	var _google_map_loader2 = _interopRequireDefault(_google_map_loader);

	var _detect = __webpack_require__(13);

	var _detect2 = _interopRequireDefault(_detect);

	var _geo = __webpack_require__(15);

	var _geo2 = _interopRequireDefault(_geo);

	var _array_helper = __webpack_require__(12);

	var _array_helper2 = _interopRequireDefault(_array_helper);

	var _is_plain_object = __webpack_require__(17);

	var _is_plain_object2 = _interopRequireDefault(_is_plain_object);

	var _pick = __webpack_require__(21);

	var _pick2 = _interopRequireDefault(_pick);

	var _raf = __webpack_require__(22);

	var _raf2 = _interopRequireDefault(_raf);

	var _log = __webpack_require__(20);

	var _log2 = _interopRequireDefault(_log);

	var _isNumber = __webpack_require__(16);

	var _isNumber2 = _interopRequireDefault(_isNumber);

	var _omit = __webpack_require__(5);

	var _omit2 = _interopRequireDefault(_omit);

	var _detectElementResize = __webpack_require__(14);

	var _detectElementResize2 = _interopRequireDefault(_detectElementResize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var kEPS = 0.00001;
	var K_GOOGLE_TILE_SIZE = 256;
	// real minZoom calculated here _getMinZoom
	var K_IDLE_TIMEOUT = 100;
	var K_IDLE_CLICK_TIMEOUT = 300;
	var DEFAULT_MIN_ZOOM = 3;

	function defaultOptions_() /* maps */{
	  return {
	    overviewMapControl: false,
	    streetViewControl: false,
	    rotateControl: true,
	    mapTypeControl: false,
	    // disable poi
	    styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
	    minZoom: DEFAULT_MIN_ZOOM };
	}

	var latLng2Obj = function latLng2Obj(latLng) {
	  return (0, _is_plain_object2.default)(latLng) ? latLng : { lat: latLng[0], lng: latLng[1] };
	};

	var GoogleMap = function (_Component) {
	  _inherits(GoogleMap, _Component);

	  // eslint-disable-line

	  function GoogleMap(props) {
	    _classCallCheck(this, GoogleMap);

	    var _this = _possibleConstructorReturn(this, (GoogleMap.__proto__ || Object.getPrototypeOf(GoogleMap)).call(this, props));

	    _this._getMinZoom = function () {
	      if (_this.geoService_.getWidth() > 0 || _this.geoService_.getHeight() > 0) {
	        var tilesPerWidth = Math.ceil(_this.geoService_.getWidth() / K_GOOGLE_TILE_SIZE) + 2;
	        var tilesPerHeight = Math.ceil(_this.geoService_.getHeight() / K_GOOGLE_TILE_SIZE) + 2;
	        var maxTilesPerDim = Math.max(tilesPerWidth, tilesPerHeight);
	        return Math.ceil((0, _log2.default)(maxTilesPerDim));
	      }
	      return DEFAULT_MIN_ZOOM;
	    };

	    _this._computeMinZoom = function (minZoomOverride, minZoom) {
	      if (minZoomOverride) {
	        return minZoom || DEFAULT_MIN_ZOOM;
	      }
	      return _this._getMinZoom();
	    };

	    _this._mapDomResizeCallback = function () {
	      _this.resetSizeOnIdle_ = true;
	      if (_this.maps_) {
	        _this.maps_.event.trigger(_this.map_, 'resize');
	      }
	    };

	    _this._initMap = function () {
	      // only initialize the map once
	      if (_this.initialized_) {
	        return;
	      }
	      _this.initialized_ = true;

	      var propsCenter = latLng2Obj(_this.props.center || _this.props.defaultCenter);
	      _this.geoService_.setView(propsCenter, _this.props.zoom || _this.props.defaultZoom, 0);

	      _this._onBoundsChanged(); // now we can calculate map bounds center etc...

	      var bootstrapURLKeys = _extends({}, _this.props.apiKey && { key: _this.props.apiKey }, _this.props.bootstrapURLKeys);

	      _this.props.googleMapLoader(bootstrapURLKeys).then(function (maps) {
	        if (!_this.mounted_) {
	          return;
	        }

	        var centerLatLng = _this.geoService_.getCenter();

	        var propsOptions = {
	          zoom: _this.props.zoom || _this.props.defaultZoom,
	          center: new maps.LatLng(centerLatLng.lat, centerLatLng.lng)
	        };

	        // prevent to exapose full api
	        // next props must be exposed (console.log(Object.keys(pick(maps, isPlainObject))))
	        // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
	        // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition",
	        // "SymbolPath", "ZoomControlStyle",
	        // "event", "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem",
	        // "DistanceMatrixStatus",
	        // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType",
	        // "GeocoderStatus", "KmlLayerStatus",
	        // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference",
	        // "TravelMode", "UnitSystem"
	        var mapPlainObjects = (0, _pick2.default)(maps, _is_plain_object2.default);
	        var options = typeof _this.props.options === 'function' ? _this.props.options(mapPlainObjects) : _this.props.options;
	        var defaultOptions = defaultOptions_(mapPlainObjects);

	        var draggableOptions = _this.props.draggable !== undefined && { draggable: _this.props.draggable };

	        var minZoom = _this._computeMinZoom(options.minZoomOverride, options.minZoom);
	        _this.minZoom_ = minZoom;

	        var preMapOptions = _extends({}, defaultOptions, {
	          minZoom: minZoom
	        }, options, propsOptions);

	        _this.defaultDraggableOption_ = preMapOptions.draggable !== undefined ? preMapOptions.draggable : _this.defaultDraggableOption_;

	        var mapOptions = _extends({}, preMapOptions, draggableOptions);

	        mapOptions.minZoom = _this._checkMinZoom(mapOptions.minZoom, minZoom);

	        var map = new maps.Map(_reactDom2.default.findDOMNode(_this.refs.google_map_dom), mapOptions);
	        _this.map_ = map;
	        _this.maps_ = maps;

	        // render in overlay
	        var this_ = _this;
	        var overlay = _this.overlay_ = Object.assign(new maps.OverlayView(), {
	          onAdd: function onAdd() {
	            var K_MAX_WIDTH = typeof screen !== 'undefined' ? screen.width + 'px' : '2000px';
	            var K_MAX_HEIGHT = typeof screen !== 'undefined' ? screen.height + 'px' : '2000px';

	            var div = document.createElement('div');
	            this.div = div;
	            div.style.backgroundColor = 'transparent';
	            div.style.position = 'absolute';
	            div.style.left = '0px';
	            div.style.top = '0px';
	            div.style.width = K_MAX_WIDTH; // prevents some chrome draw defects
	            div.style.height = K_MAX_HEIGHT;

	            var panes = this.getPanes();
	            panes.overlayMouseTarget.appendChild(div);

	            _reactDom2.default.unstable_renderSubtreeIntoContainer(this_, _react2.default.createElement(_google_map_markers2.default, {
	              experimental: this_.props.experimental,
	              onChildClick: this_._onChildClick,
	              onChildMouseDown: this_._onChildMouseDown,
	              onChildMouseEnter: this_._onChildMouseEnter,
	              onChildMouseLeave: this_._onChildMouseLeave,
	              geoService: this_.geoService_,
	              projectFromLeftTop: true,
	              distanceToMouse: this_.props.distanceToMouse,
	              getHoverDistance: this_._getHoverDistance,
	              dispatcher: this_.markersDispatcher_
	            }), div,
	            // remove prerendered markers
	            function () {
	              return this_.setState({ overlayCreated: true });
	            });
	          },
	          onRemove: function onRemove() {
	            _reactDom2.default.unmountComponentAtNode(this.div);
	          },
	          draw: function draw() {
	            var div = overlay.div;
	            var overlayProjection = overlay.getProjection();
	            var bounds = map.getBounds();
	            var ne = bounds.getNorthEast();
	            var sw = bounds.getSouthWest();
	            var ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));

	            // need round for safari still can't find what need for firefox
	            var ptxRounded = (0, _detect2.default)().isSafari ? { x: Math.round(ptx.x), y: Math.round(ptx.y) } : { x: ptx.x, y: ptx.y };

	            this_.updateCounter_++;
	            this_._onBoundsChanged(map, maps, !this_.props.debounced);

	            if (!this_.googleApiLoadedCalled_) {
	              this_._onGoogleApiLoaded({ map: map, maps: maps });
	              this_.googleApiLoadedCalled_ = true;
	            }

	            div.style.left = ptxRounded.x + 'px';
	            div.style.top = ptxRounded.y + 'px';
	            if (this_.markersDispatcher_) {
	              this_.markersDispatcher_.emit('kON_CHANGE');
	            }
	          }
	        });

	        overlay.setMap(map);

	        maps.event.addListener(map, 'zoom_changed', function () {
	          // recalc position at zoom start
	          if (this_.geoService_.getZoom() !== map.getZoom()) {
	            if (!this_.zoomAnimationInProgress_) {
	              this_.zoomAnimationInProgress_ = true;
	              this_._onZoomAnimationStart();
	            }

	            var TIMEOUT_ZOOM = 300;

	            if (new Date().getTime() - _this.zoomControlClickTime_ < TIMEOUT_ZOOM) {
	              // there is strange Google Map Api behavior in chrome when zoom animation of map
	              // is started only on second raf call, if was click on zoom control
	              // or +- keys pressed, so i wait for two rafs before change state

	              // this does not fully prevent animation jump
	              // but reduce it's occurence probability
	              (0, _raf2.default)(function () {
	                return (0, _raf2.default)(function () {
	                  this_.updateCounter_++;
	                  this_._onBoundsChanged(map, maps);
	                });
	              });
	            } else {
	              this_.updateCounter_++;
	              this_._onBoundsChanged(map, maps);
	            }
	          }
	        });

	        maps.event.addListener(map, 'idle', function () {
	          if (_this.resetSizeOnIdle_) {
	            _this._setViewSize();
	            var currMinZoom = _this._computeMinZoom(_this.props.options.minZoomOverride, _this.props.options.minZoom);

	            if (currMinZoom !== _this.minZoom_) {
	              _this.minZoom_ = currMinZoom;
	              map.setOptions({ minZoom: currMinZoom });
	            }

	            _this.resetSizeOnIdle_ = false;
	          }

	          if (this_.zoomAnimationInProgress_) {
	            this_.zoomAnimationInProgress_ = false;
	            this_._onZoomAnimationEnd();
	          }

	          var div = overlay.div;
	          var overlayProjection = overlay.getProjection();
	          var bounds = map.getBounds();
	          var ne = bounds.getNorthEast();
	          var sw = bounds.getSouthWest();
	          var ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));
	          // need round for safari still can't find what need for firefox
	          var ptxRounded = (0, _detect2.default)().isSafari ? { x: Math.round(ptx.x), y: Math.round(ptx.y) } : { x: ptx.x, y: ptx.y };

	          this_.updateCounter_++;
	          this_._onBoundsChanged(map, maps);

	          if (_this.mouse_) {
	            var latLng = _this.geoService_.unproject(_this.mouse_, true);
	            _this.mouse_.lat = latLng.lat;
	            _this.mouse_.lng = latLng.lng;
	          }

	          _this._onChildMouseMove();

	          this_.dragTime_ = 0;
	          div.style.left = ptxRounded.x + 'px';
	          div.style.top = ptxRounded.y + 'px';
	          if (this_.markersDispatcher_) {
	            this_.markersDispatcher_.emit('kON_CHANGE');
	            if (this_.fireMouseEventOnIdle_) {
	              this_.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
	            }
	          }
	        });

	        maps.event.addListener(map, 'mouseover', function () {
	          // has advantage over div MouseLeave
	          this_.mouseInMap_ = true;
	        });

	        maps.event.addListener(map, 'mouseout', function () {
	          // has advantage over div MouseLeave
	          this_.mouseInMap_ = false;
	          this_.mouse_ = null;
	          this_.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
	        });

	        maps.event.addListener(map, 'drag', function () {
	          this_.dragTime_ = new Date().getTime();
	          this_._onDrag();
	        });
	      }).catch(function (e) {
	        console.error(e); // eslint-disable-line no-console
	        throw e;
	      });
	    };

	    _this._onGoogleApiLoaded = function () {
	      if (_this.props.onGoogleApiLoaded) {
	        var _this$props;

	        if (("development") !== 'production' && _this.props.yesIWantToUseGoogleMapApiInternals !== true) {
	          console.warn('GoogleMap: ' + // eslint-disable-line
	          'Usage of internal api objects is dangerous ' + 'and can cause a lot of issues.\n' + 'To hide this warning add yesIWantToUseGoogleMapApiInternals={true} ' + 'to <GoogleMap instance');
	        }

	        (_this$props = _this.props).onGoogleApiLoaded.apply(_this$props, arguments);
	      }
	    };

	    _this._getHoverDistance = function () {
	      return _this.props.hoverDistance;
	    };

	    _this._onDrag = function () {
	      var _this$props2;

	      return _this.props.onDrag && (_this$props2 = _this.props).onDrag.apply(_this$props2, arguments);
	    };

	    _this._onZoomAnimationStart = function () {
	      var _this$props3;

	      return _this.props.onZoomAnimationStart && (_this$props3 = _this.props).onZoomAnimationStart.apply(_this$props3, arguments);
	    };

	    _this._onZoomAnimationEnd = function () {
	      var _this$props4;

	      return _this.props.onZoomAnimationEnd && (_this$props4 = _this.props).onZoomAnimationEnd.apply(_this$props4, arguments);
	    };

	    _this._onChildClick = function () {
	      if (_this.props.onChildClick) {
	        var _this$props5;

	        return (_this$props5 = _this.props).onChildClick.apply(_this$props5, arguments);
	      }
	      return undefined;
	    };

	    _this._onChildMouseDown = function (hoverKey, childProps) {
	      _this.childMouseDownArgs_ = [hoverKey, childProps];
	      if (_this.props.onChildMouseDown) {
	        _this.props.onChildMouseDown(hoverKey, childProps, _extends({}, _this.mouse_));
	      }
	    };

	    _this._onChildMouseUp = function () {
	      if (_this.childMouseDownArgs_) {
	        if (_this.props.onChildMouseUp) {
	          var _this$props6;

	          (_this$props6 = _this.props).onChildMouseUp.apply(_this$props6, _toConsumableArray(_this.childMouseDownArgs_).concat([_extends({}, _this.mouse_)]));
	        }
	        _this.childMouseDownArgs_ = null;
	        _this.childMouseUpTime_ = new Date().getTime();
	      }
	    };

	    _this._onChildMouseMove = function () {
	      if (_this.childMouseDownArgs_) {
	        if (_this.props.onChildMouseMove) {
	          var _this$props7;

	          (_this$props7 = _this.props).onChildMouseMove.apply(_this$props7, _toConsumableArray(_this.childMouseDownArgs_).concat([_extends({}, _this.mouse_)]));
	        }
	      }
	    };

	    _this._onChildMouseEnter = function () {
	      if (_this.props.onChildMouseEnter) {
	        var _this$props8;

	        return (_this$props8 = _this.props).onChildMouseEnter.apply(_this$props8, arguments);
	      }
	      return undefined;
	    };

	    _this._onChildMouseLeave = function () {
	      if (_this.props.onChildMouseLeave) {
	        var _this$props9;

	        return (_this$props9 = _this.props).onChildMouseLeave.apply(_this$props9, arguments);
	      }
	      return undefined;
	    };

	    _this._setViewSize = function () {
	      if (!_this.mounted_) return;

	      var mapDom = _reactDom2.default.findDOMNode(_this.refs.google_map_dom);
	      _this.geoService_.setViewSize(mapDom.clientWidth, mapDom.clientHeight);
	      _this._onBoundsChanged();
	    };

	    _this._onWindowResize = function () {
	      _this.resetSizeOnIdle_ = true;
	    };

	    _this._onMapMouseMove = function (e) {
	      if (!_this.mouseInMap_) return;

	      var currTime = new Date().getTime();
	      var K_RECALC_CLIENT_RECT_MS = 50;

	      if (currTime - _this.mouseMoveTime_ > K_RECALC_CLIENT_RECT_MS) {
	        _this.boundingRect_ = e.currentTarget.getBoundingClientRect();
	      }
	      _this.mouseMoveTime_ = currTime;

	      var mousePosX = e.clientX - _this.boundingRect_.left;
	      var mousePosY = e.clientY - _this.boundingRect_.top;

	      if (!_this.mouse_) {
	        _this.mouse_ = { x: 0, y: 0, lat: 0, lng: 0 };
	      }

	      _this.mouse_.x = mousePosX;
	      _this.mouse_.y = mousePosY;

	      var latLng = _this.geoService_.unproject(_this.mouse_, true);
	      _this.mouse_.lat = latLng.lat;
	      _this.mouse_.lng = latLng.lng;

	      _this._onChildMouseMove();

	      if (currTime - _this.dragTime_ < K_IDLE_TIMEOUT) {
	        _this.fireMouseEventOnIdle_ = true;
	      } else {
	        _this.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
	        _this.fireMouseEventOnIdle_ = false;
	      }
	    };

	    _this._onClick = function () {
	      var _this$props10;

	      return _this.props.onClick && !_this.childMouseDownArgs_ && new Date().getTime() - _this.childMouseUpTime_ > K_IDLE_CLICK_TIMEOUT && _this.dragTime_ === 0 && (_this$props10 = _this.props).onClick.apply(_this$props10, arguments);
	    };

	    _this._onMapClick = function (event) {
	      if (_this.markersDispatcher_) {
	        // support touch events and recalculate mouse position on click
	        _this._onMapMouseMove(event);
	        var currTime = new Date().getTime();
	        if (currTime - _this.dragTime_ > K_IDLE_TIMEOUT) {
	          if (_this.mouse_) {
	            _this._onClick(_extends({}, _this.mouse_, {
	              event: event
	            }));
	          }

	          _this.markersDispatcher_.emit('kON_CLICK', event);
	        }
	      }
	    };

	    _this._onMapMouseDownNative = function (event) {
	      if (!_this.mouseInMap_) return;

	      _this._onMapMouseDown(event);
	      if (_this.props.draggable === false) {
	        event.preventDefault();
	        event.stopPropagation();
	      }
	    };

	    _this._onMapMouseDown = function (event) {
	      if (_this.markersDispatcher_) {
	        var currTime = new Date().getTime();
	        if (currTime - _this.dragTime_ > K_IDLE_TIMEOUT) {
	          // Hovered marker detected at mouse move could be deleted at mouse down time
	          // so it will be good to force hovered marker recalculation
	          _this._onMapMouseMove(event);
	          _this.markersDispatcher_.emit('kON_MDOWN', event);
	        }
	      }
	    };

	    _this._onMapMouseDownCapture = function () {
	      if ((0, _detect2.default)().isChrome) {
	        // to fix strange zoom in chrome
	        if (!_this.mouse_) {
	          _this.zoomControlClickTime_ = new Date().getTime();
	        }
	      }
	    };

	    _this._onKeyDownCapture = function () {
	      if ((0, _detect2.default)().isChrome) {
	        _this.zoomControlClickTime_ = new Date().getTime();
	      }
	    };

	    _this._onTouchMove = function (event) {
	      if (_this.refs.google_map_dom) {
	        var mapDom = _reactDom2.default.findDOMNode(_this.refs.google_map_dom);
	        if (mapDom.contains(event.target)) {
	          event.preventDefault();
	        }
	      }
	    };

	    _this._isCenterDefined = function (center) {
	      return center && ((0, _is_plain_object2.default)(center) && (0, _isNumber2.default)(center.lat) && (0, _isNumber2.default)(center.lng) || center.length === 2 && (0, _isNumber2.default)(center[0]) && (0, _isNumber2.default)(center[1]));
	    };

	    _this._onBoundsChanged = function (map, maps, callExtBoundsChange) {
	      if (map) {
	        var gmC = map.getCenter();
	        _this.geoService_.setView([gmC.lat(), gmC.lng()], map.getZoom(), 0);
	      }

	      if ((_this.props.onChange || _this.props.onBoundsChange) && _this.geoService_.canProject()) {
	        var zoom = _this.geoService_.getZoom();
	        var bounds = _this.geoService_.getBounds();
	        var centerLatLng = _this.geoService_.getCenter();

	        if (!(0, _array_helper2.default)(bounds, _this.prevBounds_, kEPS)) {
	          if (callExtBoundsChange !== false) {
	            var marginBounds = _this.geoService_.getBounds(_this.props.margin);
	            if (_this.props.onBoundsChange) {
	              _this.props.onBoundsChange(_this.centerIsObject_ ? _extends({}, centerLatLng) : [centerLatLng.lat, centerLatLng.lng], zoom, bounds, marginBounds);
	            }

	            if (_this.props.onChange) {
	              _this.props.onChange({
	                center: _extends({}, centerLatLng),
	                zoom: zoom,
	                bounds: {
	                  nw: {
	                    lat: bounds[0],
	                    lng: bounds[1]
	                  },
	                  se: {
	                    lat: bounds[2],
	                    lng: bounds[3]
	                  }
	                },
	                marginBounds: {
	                  nw: {
	                    lat: marginBounds[0],
	                    lng: marginBounds[1]
	                  },
	                  se: {
	                    lat: marginBounds[2],
	                    lng: marginBounds[3]
	                  }
	                },

	                size: _this.geoService_.hasSize() ? {
	                  width: _this.geoService_.getWidth(),
	                  height: _this.geoService_.getHeight()
	                } : {
	                  width: 0,
	                  height: 0
	                }
	              });
	            }

	            _this.prevBounds_ = bounds;
	          }
	        }
	        // uncomment for strange bugs
	        if (true) {
	          // compare with google calculations
	          if (map) {
	            var locBounds = map.getBounds();
	            var ne = locBounds.getNorthEast();
	            var sw = locBounds.getSouthWest();

	            var _gmC = map.getCenter();
	            // compare with google map

	            if (!(0, _array_helper2.default)([centerLatLng.lat, centerLatLng.lng], [_gmC.lat(), _gmC.lng()], kEPS)) {
	              console.info('GoogleMap center not eq:', // eslint-disable-line no-console
	              [centerLatLng.lat, centerLatLng.lng], [_gmC.lat(), _gmC.lng()]);
	            }

	            if (!(0, _array_helper2.default)(bounds, // eslint-disable-line
	            [ne.lat(), sw.lng(), sw.lat(), ne.lng()], kEPS // eslint-disable-line no-console
	            ) && !_this.props.resetBoundsOnResize) {
	              // eslint-disable-line no-console
	              // this is normal if this message occured on resize
	              console.info('GoogleMap bounds not eq:', '\n', // eslint-disable-line no-console
	              bounds, '\n', [ne.lat(), sw.lng(), sw.lat(), ne.lng()]);
	            }
	          }
	        }
	      }
	    };

	    _this.mounted_ = false;
	    _this.initialized_ = false;
	    _this.googleApiLoadedCalled_ = false;

	    _this.map_ = null;
	    _this.maps_ = null;
	    _this.prevBounds_ = null;

	    _this.mouse_ = null;
	    _this.mouseMoveTime_ = 0;
	    _this.boundingRect_ = null;
	    _this.mouseInMap_ = true;

	    _this.dragTime_ = 0;
	    _this.fireMouseEventOnIdle_ = false;
	    _this.updateCounter_ = 0;

	    _this.markersDispatcher_ = new _marker_dispatcher2.default(_this);
	    _this.geoService_ = new _geo2.default(K_GOOGLE_TILE_SIZE);
	    _this.centerIsObject_ = (0, _is_plain_object2.default)(_this.props.center);

	    _this.minZoom_ = DEFAULT_MIN_ZOOM;
	    _this.defaultDraggableOption_ = true;

	    _this.zoomControlClickTime_ = 0;

	    _this.childMouseDownArgs_ = null;
	    _this.childMouseUpTime_ = 0;

	    if (true) {
	      if (_this.props.apiKey) {
	        console.warn('GoogleMap: ' + // eslint-disable-line no-console
	        'apiKey is deprecated, use ' + 'bootstrapURLKeys={{key: YOUR_API_KEY}} instead.');
	      }

	      if (_this.props.onBoundsChange) {
	        console.warn('GoogleMap: ' + // eslint-disable-line no-console
	        'onBoundsChange is deprecated, use ' + 'onChange({center, zoom, bounds, ...other}) instead.');
	      }

	      if (_this.props.center === undefined && _this.props.defaultCenter === undefined) {
	        console.warn('GoogleMap: center or defaultCenter' + // eslint-disable-line no-console
	        'property must be defined');
	      }

	      if (_this.props.zoom === undefined && _this.props.defaultZoom === undefined) {
	        console.warn('GoogleMap: zoom or defaultZoom' + // eslint-disable-line no-console
	        'property must be defined');
	      }
	    }

	    if (_this._isCenterDefined(_this.props.center || _this.props.defaultCenter)) {
	      var propsCenter = latLng2Obj(_this.props.center || _this.props.defaultCenter);
	      _this.geoService_.setView(propsCenter, _this.props.zoom || _this.props.defaultZoom, 0);
	    }

	    _this.zoomAnimationInProgress_ = false;

	    _this.state = {
	      overlayCreated: false
	    };
	    return _this;
	  }

	  _createClass(GoogleMap, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      this.mounted_ = true;
	      window.addEventListener('resize', this._onWindowResize);
	      window.addEventListener('keydown', this._onKeyDownCapture, true);

	      // prevent touch devices from moving the entire browser window on drag
	      window.addEventListener('touchmove', this._onTouchMove);

	      var mapDom = _reactDom2.default.findDOMNode(this.refs.google_map_dom);
	      // gmap can't prevent map drag if mousedown event already occured
	      // the only workaround I find is prevent mousedown native browser event
	      _reactDom2.default.findDOMNode(this.refs.google_map_dom).addEventListener('mousedown', this._onMapMouseDownNative, true);

	      window.addEventListener('mouseup', this._onChildMouseUp, false);

	      var bootstrapURLKeys = _extends({}, this.props.apiKey && { key: this.props.apiKey }, this.props.bootstrapURLKeys);

	      this.props.googleMapLoader(bootstrapURLKeys); // we can start load immediatly

	      setTimeout(function () {
	        // to detect size
	        _this2._setViewSize();
	        if (_this2._isCenterDefined(_this2.props.center || _this2.props.defaultCenter)) {
	          _this2._initMap();
	        }
	      }, 0, this);
	      if (this.props.resetBoundsOnResize) {
	        var that = this;
	        _detectElementResize2.default.addResizeListener(mapDom, that._mapDomResizeCallback);
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _this3 = this;

	      if (true) {
	        if (this.props.defaultCenter !== nextProps.defaultCenter) {
	          console.warn('GoogleMap: defaultCenter prop changed. ' + // eslint-disable-line
	          'You can\'t change default props.');
	        }

	        if (this.props.defaultZoom !== nextProps.defaultZoom) {
	          console.warn('GoogleMap: defaultZoom prop changed. ' + // eslint-disable-line
	          'You can\'t change default props.');
	        }
	      }

	      if (!this._isCenterDefined(this.props.center) && this._isCenterDefined(nextProps.center)) {
	        setTimeout(function () {
	          return _this3._initMap();
	        }, 0);
	      }

	      if (this.map_) {
	        var centerLatLng = this.geoService_.getCenter();
	        if (this._isCenterDefined(nextProps.center)) {
	          var nextPropsCenter = latLng2Obj(nextProps.center);
	          var currCenter = this._isCenterDefined(this.props.center) ? latLng2Obj(this.props.center) : null;

	          if (!currCenter || Math.abs(nextPropsCenter.lat - currCenter.lat) + Math.abs(nextPropsCenter.lng - currCenter.lng) > kEPS) {
	            if (Math.abs(nextPropsCenter.lat - centerLatLng.lat) + Math.abs(nextPropsCenter.lng - centerLatLng.lng) > kEPS) {
	              this.map_.panTo({ lat: nextPropsCenter.lat, lng: nextPropsCenter.lng });
	            }
	          }
	        }

	        if (nextProps.zoom !== undefined) {
	          // if zoom chaged by user
	          if (Math.abs(nextProps.zoom - this.props.zoom) > 0) {
	            this.map_.setZoom(nextProps.zoom);
	          }
	        }

	        if (this.props.draggable !== undefined && nextProps.draggable === undefined) {
	          // reset to default
	          this.map_.setOptions({ draggable: this.defaultDraggableOption_ });
	        } else if (this.props.draggable !== nextProps.draggable) {
	          // also prevent this on window 'mousedown' event to prevent map move
	          this.map_.setOptions({ draggable: nextProps.draggable });
	        }

	        // use shallowEqual to try avoid calling map._setOptions if only the ref changes
	        if (nextProps.options !== undefined && !(0, _shallowEqual2.default)(this.props.options, nextProps.options)) {
	          var mapPlainObjects = (0, _pick2.default)(this.maps_, _is_plain_object2.default);
	          var options = typeof nextProps.options === 'function' ? nextProps.options(mapPlainObjects) : nextProps.options;
	          // remove zoom, center and draggable options as these are managed by google-maps-react
	          options = (0, _omit2.default)(nextProps.options, ['zoom', 'center', 'draggable']);

	          if (options.hasOwnProperty('minZoom')) {
	            var minZoom = this._computeMinZoom(options.minZoomOverride, options.minZoom);
	            options.minZoom = this._checkMinZoom(options.minZoom, minZoom);
	          }

	          this.map_.setOptions(options);
	        }
	      }
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      // draggable does not affect inner components
	      return !(0, _shallowEqual2.default)((0, _omit2.default)(this.props, ['draggable']), (0, _omit2.default)(nextProps, ['draggable'])) || !(0, _shallowEqual2.default)(this.state, nextState);
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      this.markersDispatcher_.emit('kON_CHANGE');

	      if (this.props.hoverDistance !== prevProps.hoverDistance) {
	        this.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.mounted_ = false;
	      var that = this;
	      var mapDom = _reactDom2.default.findDOMNode(this.refs.google_map_dom);
	      window.removeEventListener('resize', this._onWindowResize);
	      window.removeEventListener('keydown', this._onKeyDownCapture);
	      mapDom.removeEventListener('mousedown', this._onMapMouseDownNative, true);
	      window.removeEventListener('mouseup', this._onChildMouseUp, false);
	      window.removeEventListener('touchmove', this._onTouchMove);
	      _detectElementResize2.default.addResizeListener(mapDom, that._mapDomResizeCallback);

	      if (this.overlay_) {
	        // this triggers overlay_.onRemove(), which will unmount the <GoogleMapMarkers/>
	        this.overlay_.setMap(null);
	      }

	      if (this.maps_ && this.map_) {
	        this.maps_.event.clearInstanceListeners(this.map_);
	      }

	      this.map_ = null;
	      this.maps_ = null;
	      this.markersDispatcher_.dispose();

	      this.resetSizeOnIdle_ = false;

	      delete this.map_;
	      delete this.markersDispatcher_;
	    }
	    // calc minZoom if map size available
	    // it's better to not set minZoom less than this calculation gives
	    // otherwise there is no homeomorphism between screen coordinates and map
	    // (one map coordinate can have different screen coordinates)

	  }, {
	    key: '_checkMinZoom',
	    value: function _checkMinZoom(zoom, minZoom) {
	      if (true) {
	        if (zoom < minZoom) {
	          console.warn('GoogleMap: ' + // eslint-disable-line
	          'minZoom option is less than recommended ' + 'minZoom option for your map sizes.\n' + 'overrided to value ' + minZoom);
	        }
	      }

	      if (minZoom < zoom) {
	        return zoom;
	      }
	      return minZoom;
	    }

	    // this method works only if this.props.onChildMouseDown was called


	    // this method works only if this.props.onChildMouseDown was called


	    // K_IDLE_CLICK_TIMEOUT - looks like 300 is enough


	    // gmap can't prevent map drag if mousedown event already occured
	    // the only workaround I find is prevent mousedown native browser event

	  }, {
	    key: 'render',
	    value: function render() {
	      var mapMarkerPrerender = !this.state.overlayCreated ? _react2.default.createElement(_google_map_markers_prerender2.default, {
	        experimental: this.props.experimental,
	        onChildClick: this._onChildClick,
	        onChildMouseDown: this._onChildMouseDown,
	        onChildMouseEnter: this._onChildMouseEnter,
	        onChildMouseLeave: this._onChildMouseLeave,
	        geoService: this.geoService_,
	        projectFromLeftTop: false,
	        distanceToMouse: this.props.distanceToMouse,
	        getHoverDistance: this._getHoverDistance,
	        dispatcher: this.markersDispatcher_
	      }) : null;

	      return _react2.default.createElement(
	        'div',
	        {
	          style: this.props.style,
	          onMouseMove: this._onMapMouseMove,
	          onMouseDownCapture: this._onMapMouseDownCapture,
	          onClick: this._onMapClick
	        },
	        _react2.default.createElement(_google_map_map2.default, { ref: 'google_map_dom' }),
	        mapMarkerPrerender
	      );
	    }
	  }]);

	  return GoogleMap;
	}(_react.Component);

	GoogleMap.propTypes = {
	  apiKey: _react.PropTypes.string,
	  bootstrapURLKeys: _react.PropTypes.any,

	  defaultCenter: _react2.default.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.shape({
	    lat: _react.PropTypes.number,
	    lng: _react.PropTypes.number
	  })]),
	  center: _react2.default.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.shape({
	    lat: _react.PropTypes.number,
	    lng: _react.PropTypes.number
	  })]),
	  defaultZoom: _react.PropTypes.number,
	  zoom: _react.PropTypes.number,
	  onBoundsChange: _react.PropTypes.func,
	  onChange: _react.PropTypes.func,
	  onClick: _react.PropTypes.func,
	  onChildClick: _react.PropTypes.func,
	  onChildMouseDown: _react.PropTypes.func,
	  onChildMouseUp: _react.PropTypes.func,
	  onChildMouseMove: _react.PropTypes.func,
	  onChildMouseEnter: _react.PropTypes.func,
	  onChildMouseLeave: _react.PropTypes.func,
	  onZoomAnimationStart: _react.PropTypes.func,
	  onZoomAnimationEnd: _react.PropTypes.func,
	  onDrag: _react.PropTypes.func,
	  options: _react.PropTypes.any,
	  distanceToMouse: _react.PropTypes.func,
	  hoverDistance: _react.PropTypes.number,
	  debounced: _react.PropTypes.bool,
	  margin: _react.PropTypes.array,
	  googleMapLoader: _react.PropTypes.any,
	  onGoogleApiLoaded: _react.PropTypes.func,
	  yesIWantToUseGoogleMapApiInternals: _react.PropTypes.bool,
	  draggable: _react.PropTypes.bool,
	  style: _react.PropTypes.any,
	  resetBoundsOnResize: _react.PropTypes.bool
	};
	GoogleMap.defaultProps = {
	  distanceToMouse: function distanceToMouse(pt, mousePos /* , markerProps */) {
	    return Math.sqrt((pt.x - mousePos.x) * (pt.x - mousePos.x) + (pt.y - mousePos.y) * (pt.y - mousePos.y));
	  },

	  hoverDistance: 30,
	  debounced: true,
	  options: defaultOptions_,
	  googleMapLoader: _google_map_loader2.default,
	  yesIWantToUseGoogleMapApiInternals: false,
	  style: {
	    width: '100%',
	    height: '100%',
	    margin: 0,
	    padding: 0,
	    position: 'relative'
	  }
	};
	GoogleMap.googleMapLoader = _google_map_loader2.default;
	exports.default = GoogleMap;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var style = {
	  width: '100%',
	  height: '100%',
	  left: 0,
	  top: 0,
	  margin: 0,
	  padding: 0,
	  position: 'absolute'
	};

	var GoogleMapMap = function (_Component) {
	  _inherits(GoogleMapMap, _Component);

	  function GoogleMapMap() {
	    _classCallCheck(this, GoogleMapMap);

	    return _possibleConstructorReturn(this, (GoogleMapMap.__proto__ || Object.getPrototypeOf(GoogleMapMap)).apply(this, arguments));
	  }

	  _createClass(GoogleMapMap, [{
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate() {
	      return false; // disable react on this div
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement('div', { style: style });
	    }
	  }]);

	  return GoogleMapMap;
	}(_react.Component);

	exports.default = GoogleMapMap;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = function (props) {
	  return _react2.default.createElement(
	    'div',
	    { style: style },
	    _react2.default.createElement(_google_map_markers2.default, _extends({}, props, { prerender: true }))
	  );
	};

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _google_map_markers = __webpack_require__(2);

	var _google_map_markers2 = _interopRequireDefault(_google_map_markers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var style = {
	  width: '50%',
	  height: '50%',
	  left: '50%',
	  top: '50%',
	  // backgroundColor: 'red',
	  margin: 0,
	  padding: 0,
	  position: 'absolute'
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _eventemitter = __webpack_require__(23);

	var _eventemitter2 = _interopRequireDefault(_eventemitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MarkerDispatcher = function (_EventEmitter) {
	  _inherits(MarkerDispatcher, _EventEmitter);

	  function MarkerDispatcher(gmapInstance) {
	    _classCallCheck(this, MarkerDispatcher);

	    var _this = _possibleConstructorReturn(this, (MarkerDispatcher.__proto__ || Object.getPrototypeOf(MarkerDispatcher)).call(this));

	    _this.gmapInstance = gmapInstance;
	    return _this;
	  }

	  _createClass(MarkerDispatcher, [{
	    key: 'getChildren',
	    value: function getChildren() {
	      return this.gmapInstance.props.children;
	    }
	  }, {
	    key: 'getMousePosition',
	    value: function getMousePosition() {
	      return this.gmapInstance.mouse_;
	    }
	  }, {
	    key: 'getUpdateCounter',
	    value: function getUpdateCounter() {
	      return this.gmapInstance.updateCounter_;
	    }
	  }, {
	    key: 'dispose',
	    value: function dispose() {
	      this.gmapInstance = null;
	      this.removeAllListeners();
	    }
	  }]);

	  return MarkerDispatcher;
	}(_eventemitter2.default);

	exports.default = MarkerDispatcher;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isArraysEqualEps;
	function isArraysEqualEps(arrayA, arrayB, eps) {
	  if (arrayA && arrayB) {
	    for (var i = 0; i !== arrayA.length; ++i) {
	      if (Math.abs(arrayA[i] - arrayB[i]) > eps) {
	        return false;
	      }
	    }
	    return true;
	  }
	  return false;
	}

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = detectBrowser;
	// http://stackoverflow.com/questions/5899783/detect-safari-chrome-ie-firefox-opera-with-user-agent
	var detectBrowserResult_ = null;

	function detectBrowser() {
	  if (detectBrowserResult_) {
	    return detectBrowserResult_;
	  }

	  if (typeof navigator !== 'undefined') {
	    var isExplorer = navigator.userAgent.indexOf('MSIE') > -1;
	    var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
	    var isOpera = navigator.userAgent.toLowerCase().indexOf('op') > -1;

	    var isChrome = navigator.userAgent.indexOf('Chrome') > -1;
	    var isSafari = navigator.userAgent.indexOf('Safari') > -1;

	    if (isChrome && isSafari) {
	      isSafari = false;
	    }

	    if (isChrome && isOpera) {
	      isChrome = false;
	    }

	    detectBrowserResult_ = { isExplorer: isExplorer, isFirefox: isFirefox, isOpera: isOpera, isChrome: isChrome, isSafari: isSafari };
	    return detectBrowserResult_;
	  }

	  detectBrowserResult_ = {
	    isChrome: true,
	    isExplorer: false,
	    isFirefox: false,
	    isOpera: false,
	    isSafari: false
	  };

	  return detectBrowserResult_;
	}

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	/* eslint-disable */
	/**
	* Detect Element Resize.
	* Forked in order to guard against unsafe 'window' and 'document' references.
	*
	* https://github.com/sdecima/javascript-detect-element-resize
	* Sebastian Decima
	*
	* version: 0.5.3
	**/

	// Reliable `window` and `document` detection
	var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

	// Check `document` and `window` in case of server-side rendering
	var _window;
	if (canUseDOM) {
	  _window = window;
	} else if (typeof self !== 'undefined') {
	  _window = self;
	} else {
	  _window = undefined;
	}

	var attachEvent = typeof document !== 'undefined' && document.attachEvent;
	var stylesCreated = false;

	if (canUseDOM && !attachEvent) {
	  var requestFrame = function () {
	    var raf = _window.requestAnimationFrame || _window.mozRequestAnimationFrame || _window.webkitRequestAnimationFrame || function (fn) {
	      return _window.setTimeout(fn, 20);
	    };
	    return function (fn) {
	      return raf(fn);
	    };
	  }();

	  var cancelFrame = function () {
	    var cancel = _window.cancelAnimationFrame || _window.mozCancelAnimationFrame || _window.webkitCancelAnimationFrame || _window.clearTimeout;
	    return function (id) {
	      return cancel(id);
	    };
	  }();

	  var resetTriggers = function resetTriggers(element) {
	    var triggers = element.__resizeTriggers__,
	        expand = triggers.firstElementChild,
	        contract = triggers.lastElementChild,
	        expandChild = expand.firstElementChild;
	    contract.scrollLeft = contract.scrollWidth;
	    contract.scrollTop = contract.scrollHeight;
	    expandChild.style.width = expand.offsetWidth + 1 + 'px';
	    expandChild.style.height = expand.offsetHeight + 1 + 'px';
	    expand.scrollLeft = expand.scrollWidth;
	    expand.scrollTop = expand.scrollHeight;
	  };

	  var checkTriggers = function checkTriggers(element) {
	    return element.offsetWidth != element.__resizeLast__.width || element.offsetHeight != element.__resizeLast__.height;
	  };

	  var scrollListener = function scrollListener(e) {
	    var element = this;
	    resetTriggers(this);
	    if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
	    this.__resizeRAF__ = requestFrame(function () {
	      if (checkTriggers(element)) {
	        element.__resizeLast__.width = element.offsetWidth;
	        element.__resizeLast__.height = element.offsetHeight;
	        element.__resizeListeners__.forEach(function (fn) {
	          fn.call(element, e);
	        });
	      }
	    });
	  };

	  /* Detect CSS Animations support to detect element display/re-attach */
	  var animation = false,
	      animationstring = 'animation',
	      keyframeprefix = '',
	      animationstartevent = 'animationstart',
	      domPrefixes = 'Webkit Moz O ms'.split(' '),
	      startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
	      pfx = '';

	  if (canUseDOM) {
	    var elm = document.createElement('fakeelement');
	    if (elm.style.animationName !== undefined) {
	      animation = true;
	    }

	    if (animation === false) {
	      for (var i = 0; i < domPrefixes.length; i++) {
	        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
	          pfx = domPrefixes[i];
	          animationstring = pfx + 'Animation';
	          keyframeprefix = '-' + pfx.toLowerCase() + '-';
	          animationstartevent = startEvents[i];
	          animation = true;
	          break;
	        }
	      }
	    }
	  }

	  var animationName = 'resizeanim';
	  var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
	  var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
	}

	var createStyles = function createStyles() {
	  if (!stylesCreated) {
	    //opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
	    var css = (animationKeyframes ? animationKeyframes : '') + '.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' + '.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
	        head = document.head || document.getElementsByTagName('head')[0],
	        style = document.createElement('style');

	    style.type = 'text/css';
	    if (style.styleSheet) {
	      style.styleSheet.cssText = css;
	    } else {
	      style.appendChild(document.createTextNode(css));
	    }

	    head.appendChild(style);
	    stylesCreated = true;
	  }
	};

	var addResizeListener = function addResizeListener(element, fn) {
	  if (element.parentNode === undefined) {
	    var tempParentDiv = document.createElement('div');
	    element.parentNode = tempParentDiv;
	  }
	  element = element.parentNode;
	  if (attachEvent) element.attachEvent('onresize', fn);else {
	    if (!element.__resizeTriggers__) {
	      if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
	      createStyles();
	      element.__resizeLast__ = {};
	      element.__resizeListeners__ = [];
	      (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
	      element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' + '<div class="contract-trigger"></div>';
	      element.appendChild(element.__resizeTriggers__);
	      resetTriggers(element);
	      element.addEventListener('scroll', scrollListener, true);

	      /* Listen for a css animation to detect element display/re-attach */
	      animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function (e) {
	        if (e.animationName == animationName) resetTriggers(element);
	      });
	    }
	    element.__resizeListeners__.push(fn);
	  }
	};

	var removeResizeListener = function removeResizeListener(element, fn) {
	  element = element.parentNode;
	  if (attachEvent) element.detachEvent('onresize', fn);else {
	    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
	    if (!element.__resizeListeners__.length) {
	      element.removeEventListener('scroll', scrollListener);
	      element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
	    }
	  }
	};

	module.exports = {
	  addResizeListener: addResizeListener,
	  removeResizeListener: removeResizeListener
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _lat_lng = __webpack_require__(3);

	var _lat_lng2 = _interopRequireDefault(_lat_lng);

	var _pointGeometry = __webpack_require__(7);

	var _pointGeometry2 = _interopRequireDefault(_pointGeometry);

	var _transform = __webpack_require__(18);

	var _transform2 = _interopRequireDefault(_transform);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Geo = function () {
	  function Geo(tileSize) {
	    _classCallCheck(this, Geo);

	    // left_top view пользует гугл
	    // super();
	    this.hasSize_ = false;
	    this.hasView_ = false;
	    this.transform_ = new _transform2.default(tileSize || 512);
	  }

	  _createClass(Geo, [{
	    key: 'setView',
	    value: function setView(center, zoom, bearing) {
	      this.transform_.center = _lat_lng2.default.convert(center);
	      this.transform_.zoom = +zoom;
	      this.transform_.bearing = +bearing;
	      this.hasView_ = true;
	    }
	  }, {
	    key: 'setViewSize',
	    value: function setViewSize(width, height) {
	      this.transform_.width = width;
	      this.transform_.height = height;
	      this.hasSize_ = true;
	    }
	  }, {
	    key: 'canProject',
	    value: function canProject() {
	      return this.hasSize_ && this.hasView_;
	    }
	  }, {
	    key: 'hasSize',
	    value: function hasSize() {
	      return this.hasSize_;
	    }
	  }, {
	    key: 'unproject',
	    value: function unproject(ptXY, viewFromLeftTop) {
	      var ptRes = void 0;
	      if (viewFromLeftTop) {
	        var ptxy = _extends({}, ptXY);
	        ptxy.x -= this.transform_.width / 2;
	        ptxy.y -= this.transform_.height / 2;
	        ptRes = this.transform_.pointLocation(_pointGeometry2.default.convert(ptxy));
	      } else {
	        ptRes = this.transform_.pointLocation(_pointGeometry2.default.convert(ptXY));
	      }

	      ptRes.lng -= 360 * Math.round(ptRes.lng / 360); // convert 2 google format
	      return ptRes;
	    }
	  }, {
	    key: 'project',
	    value: function project(ptLatLng, viewFromLeftTop) {
	      if (viewFromLeftTop) {
	        var pt = this.transform_.locationPoint(_lat_lng2.default.convert(ptLatLng));
	        pt.x -= this.transform_.worldSize * Math.round(pt.x / this.transform_.worldSize);

	        pt.x += this.transform_.width / 2;
	        pt.y += this.transform_.height / 2;

	        return pt;
	      }

	      return this.transform_.locationPoint(_lat_lng2.default.convert(ptLatLng));
	    }
	  }, {
	    key: 'getWidth',
	    value: function getWidth() {
	      return this.transform_.width;
	    }
	  }, {
	    key: 'getHeight',
	    value: function getHeight() {
	      return this.transform_.height;
	    }
	  }, {
	    key: 'getZoom',
	    value: function getZoom() {
	      return this.transform_.zoom;
	    }
	  }, {
	    key: 'getCenter',
	    value: function getCenter() {
	      var ptRes = this.transform_.pointLocation({ x: 0, y: 0 });

	      return ptRes;
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds(margins, roundFactor) {
	      var bndT = margins && margins[0] || 0;
	      var bndR = margins && margins[1] || 0;
	      var bndB = margins && margins[2] || 0;
	      var bndL = margins && margins[3] || 0;

	      if (this.getWidth() - bndR - bndL > 0 && this.getHeight() - bndT - bndB > 0) {
	        var topLeftCorner = this.unproject({
	          x: bndL - this.getWidth() / 2,
	          y: bndT - this.getHeight() / 2
	        });
	        var bottomRightCorner = this.unproject({
	          x: this.getWidth() / 2 - bndR,
	          y: this.getHeight() / 2 - bndB
	        });

	        var res = [topLeftCorner.lat, topLeftCorner.lng, bottomRightCorner.lat, bottomRightCorner.lng];

	        if (roundFactor) {
	          res = res.map(function (r) {
	            return Math.round(r * roundFactor) / roundFactor;
	          });
	        }
	        return res;
	      }

	      return [0, 0, 0, 0];
	    }
	  }]);

	  return Geo;
	}();

	exports.default = Geo;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = isNumber;

	function isObjectLike(value) {
	  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
	}

	var objectToString = Object.prototype.toString;

	function isNumber(value) {
	  var numberTag = '[object Number]';
	  return typeof value === 'number' || isObjectLike(value) && objectToString.call(value) === numberTag;
	}

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = isPlainObject;
	// source taken from https://github.com/rackt/redux/blob/master/src/utils/isPlainObject.js
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	function isPlainObject(obj) {
	  if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
	    return false;
	  }

	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

	  if (proto === null) {
	    return true;
	  }

	  var constructor = proto.constructor;

	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === fnToString(Object);
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _lat_lng = __webpack_require__(3);

	var _lat_lng2 = _interopRequireDefault(_lat_lng);

	var _pointGeometry = __webpack_require__(7);

	var _pointGeometry2 = _interopRequireDefault(_pointGeometry);

	var _wrap = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// A single transform, generally used for a single tile to be scaled, rotated, and zoomed.
	var Transform = function () {
	  function Transform(tileSize, minZoom, maxZoom) {
	    _classCallCheck(this, Transform);

	    this.tileSize = tileSize || 512; // constant

	    this._minZoom = minZoom || 0;
	    this._maxZoom = maxZoom || 52;

	    this.latRange = [-85.05113, 85.05113];

	    this.width = 0;
	    this.height = 0;
	    this.zoom = 0;
	    this.center = new _lat_lng2.default(0, 0);
	    this.angle = 0;
	  }

	  _createClass(Transform, [{
	    key: 'zoomScale',
	    value: function zoomScale(zoom) {
	      return Math.pow(2, zoom);
	    }
	  }, {
	    key: 'scaleZoom',
	    value: function scaleZoom(scale) {
	      return Math.log(scale) / Math.LN2;
	    }
	  }, {
	    key: 'project',
	    value: function project(latlng, worldSize) {
	      return new _pointGeometry2.default(this.lngX(latlng.lng, worldSize), this.latY(latlng.lat, worldSize));
	    }
	  }, {
	    key: 'unproject',
	    value: function unproject(point, worldSize) {
	      return new _lat_lng2.default(this.yLat(point.y, worldSize), this.xLng(point.x, worldSize));
	    }
	  }, {
	    key: 'lngX',


	    // lat/lon <-> absolute pixel coords convertion
	    value: function lngX(lon, worldSize) {
	      return (180 + lon) * (worldSize || this.worldSize) / 360;
	    }

	    // latitude to absolute y coord

	  }, {
	    key: 'latY',
	    value: function latY(lat, worldSize) {
	      var y = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
	      return (180 - y) * (worldSize || this.worldSize) / 360;
	    }
	  }, {
	    key: 'xLng',
	    value: function xLng(x, worldSize) {
	      return x * 360 / (worldSize || this.worldSize) - 180;
	    }
	  }, {
	    key: 'yLat',
	    value: function yLat(y, worldSize) {
	      var y2 = 180 - y * 360 / (worldSize || this.worldSize);
	      return 360 / Math.PI * Math.atan(Math.exp(y2 * Math.PI / 180)) - 90;
	    }
	  }, {
	    key: 'locationPoint',
	    value: function locationPoint(latlng) {
	      var p = this.project(latlng);
	      return this.centerPoint._sub(this.point._sub(p)._rotate(this.angle));
	    }
	  }, {
	    key: 'pointLocation',
	    value: function pointLocation(p) {
	      var p2 = this.centerPoint._sub(p)._rotate(-this.angle);
	      return this.unproject(this.point.sub(p2));
	    }
	  }, {
	    key: 'minZoom',
	    get: function get() {
	      return this._minZoom;
	    },
	    set: function set(zoom) {
	      this._minZoom = zoom;
	      this.zoom = Math.max(this.zoom, zoom);
	    }
	  }, {
	    key: 'maxZoom',
	    get: function get() {
	      return this._maxZoom;
	    },
	    set: function set(zoom) {
	      this._maxZoom = zoom;
	      this.zoom = Math.min(this.zoom, zoom);
	    }
	  }, {
	    key: 'worldSize',
	    get: function get() {
	      return this.tileSize * this.scale;
	    }
	  }, {
	    key: 'centerPoint',
	    get: function get() {
	      return new _pointGeometry2.default(0, 0); // this.size._div(2);
	    }
	  }, {
	    key: 'size',
	    get: function get() {
	      return new _pointGeometry2.default(this.width, this.height);
	    }
	  }, {
	    key: 'bearing',
	    get: function get() {
	      return -this.angle / Math.PI * 180;
	    },
	    set: function set(bearing) {
	      this.angle = -(0, _wrap.wrap)(bearing, -180, 180) * Math.PI / 180;
	    }
	  }, {
	    key: 'zoom',
	    get: function get() {
	      return this._zoom;
	    },
	    set: function set(zoom) {
	      var zoomV = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
	      this._zoom = zoomV;
	      this.scale = this.zoomScale(zoomV);
	      this.tileZoom = Math.floor(zoomV);
	      this.zoomFraction = zoomV - this.tileZoom;
	    }
	  }, {
	    key: 'x',
	    get: function get() {
	      return this.lngX(this.center.lng);
	    }
	  }, {
	    key: 'y',
	    get: function get() {
	      return this.latY(this.center.lat);
	    }
	  }, {
	    key: 'point',
	    get: function get() {
	      return new _pointGeometry2.default(this.x, this.y);
	    }
	  }]);

	  return Transform;
	}();

	exports.default = Transform;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = googleMapLoader;
	var $script_ = null;

	var loadPromise_ = void 0;

	var resolveCustomPromise_ = void 0;
	var _customPromise = new Promise(function (resolve) {
	  resolveCustomPromise_ = resolve;
	});

	// TODO add libraries language and other map options
	function googleMapLoader(bootstrapURLKeys) {
	  if (!$script_) {
	    $script_ = __webpack_require__(24); // eslint-disable-line
	  }

	  // call from outside google-map-react
	  // will be as soon as loadPromise_ resolved
	  if (!bootstrapURLKeys) {
	    return _customPromise;
	  }

	  if (loadPromise_) {
	    return loadPromise_;
	  }

	  loadPromise_ = new Promise(function (resolve, reject) {
	    if (typeof window === 'undefined') {
	      reject(new Error('google map cannot be loaded outside browser env'));
	      return;
	    }

	    if (window.google && window.google.maps) {
	      resolve(window.google.maps);
	      return;
	    }

	    if (typeof window._$_google_map_initialize_$_ !== 'undefined') {
	      reject(new Error('google map initialization error'));
	    }

	    window._$_google_map_initialize_$_ = function () {
	      delete window._$_google_map_initialize_$_;
	      resolve(window.google.maps);
	    };

	    if (true) {
	      if (Object.keys(bootstrapURLKeys).indexOf('callback') > -1) {
	        console.error('"callback" key in bootstrapURLKeys is not allowed, ' + // eslint-disable-line
	        'use onGoogleApiLoaded property instead');
	        throw new Error('"callback" key in bootstrapURLKeys is not allowed, ' + 'use onGoogleApiLoaded property instead');
	      }
	    }

	    var queryString = Object.keys(bootstrapURLKeys).reduce(function (r, key) {
	      return r + '&' + key + '=' + bootstrapURLKeys[key];
	    }, '');

	    $script_('https://maps.googleapis.com/maps/api/js?callback=_$_google_map_initialize_$_' + queryString, function () {
	      return typeof window.google === 'undefined' && reject(new Error('google map initialization error (not loaded)'));
	    });
	  });

	  resolveCustomPromise_(loadPromise_);

	  return loadPromise_;
	}

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var log2 = Math.log2 ? Math.log2 : function (x) {
	  return Math.log(x) / Math.LN2;
	};

	exports.default = log2;

/***/ },
/* 21 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = pick;
	// source taken from https://github.com/rackt/redux/blob/master/src/utils/pick.js

	function pick(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    if (fn(obj[key])) {
	      result[key] = obj[key]; // eslint-disable-line
	    }
	    return result;
	  }, {});
	}

/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = raf;
	function raf(callback) {
	  if (window.requestAnimationFrame) {
	    return window.requestAnimationFrame(callback);
	  }

	  var nativeRaf = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

	  return nativeRaf ? nativeRaf(callback) : window.setTimeout(callback, 1e3 / 60);
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var has = Object.prototype.hasOwnProperty;

	//
	// We store our EE objects in a plain object whose properties are event names.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// `~` to make sure that the built-in object properties are not overridden or
	// used as an attack vector.
	// We also assume that `Object.create(null)` is available when the event name
	// is an ES6 Symbol.
	//
	var prefix = typeof Object.create !== 'function' ? '~' : false;

	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} [once=false] Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }

	/**
	 * Hold the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;

	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var events = this._events
	    , names = []
	    , name;

	  if (!events) return names;

	  for (name in events) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }

	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }

	  return names;
	};

	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @param {Boolean} exists We only need to know if there are listeners.
	 * @returns {Array|Boolean}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event, exists) {
	  var evt = prefix ? prefix + event : event
	    , available = this._events && this._events[evt];

	  if (exists) return !!available;
	  if (!available) return [];
	  if (available.fn) return [available.fn];

	  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
	    ee[i] = available[i].fn;
	  }

	  return ee;
	};

	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events || !this._events[evt]) return false;

	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;

	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }

	  return this;
	};

	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} [context=this] The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true)
	    , evt = prefix ? prefix + event : event;

	  if (!this._events) this._events = prefix ? {} : Object.create(null);
	  if (!this._events[evt]) this._events[evt] = listener;
	  else {
	    if (!this._events[evt].fn) this._events[evt].push(listener);
	    else this._events[evt] = [
	      this._events[evt], listener
	    ];
	  }

	  return this;
	};

	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Mixed} context Only remove listeners matching this context.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events || !this._events[evt]) return this;

	  var listeners = this._events[evt]
	    , events = [];

	  if (fn) {
	    if (listeners.fn) {
	      if (
	           listeners.fn !== fn
	        || (once && !listeners.once)
	        || (context && listeners.context !== context)
	      ) {
	        events.push(listeners);
	      }
	    } else {
	      for (var i = 0, length = listeners.length; i < length; i++) {
	        if (
	             listeners[i].fn !== fn
	          || (once && !listeners[i].once)
	          || (context && listeners[i].context !== context)
	        ) {
	          events.push(listeners[i]);
	        }
	      }
	    }
	  }

	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[evt] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[evt];
	  }

	  return this;
	};

	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;

	  if (event) delete this._events[prefix ? prefix + event : event];
	  else this._events = prefix ? {} : Object.create(null);

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Expose the module.
	//
	if (true) {
	  module.exports = EventEmitter;
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  * $script.js JS loader & dependency manager
	  * https://github.com/ded/script.js
	  * (c) Dustin Diaz 2014 | License MIT
	  */

	(function (name, definition) {
	  if (typeof module != 'undefined' && module.exports) module.exports = definition()
	  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else this[name] = definition()
	})('$script', function () {
	  var doc = document
	    , head = doc.getElementsByTagName('head')[0]
	    , s = 'string'
	    , f = false
	    , push = 'push'
	    , readyState = 'readyState'
	    , onreadystatechange = 'onreadystatechange'
	    , list = {}
	    , ids = {}
	    , delay = {}
	    , scripts = {}
	    , scriptpath
	    , urlArgs

	  function every(ar, fn) {
	    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
	    return 1
	  }
	  function each(ar, fn) {
	    every(ar, function (el) {
	      return !fn(el)
	    })
	  }

	  function $script(paths, idOrDone, optDone) {
	    paths = paths[push] ? paths : [paths]
	    var idOrDoneIsDone = idOrDone && idOrDone.call
	      , done = idOrDoneIsDone ? idOrDone : optDone
	      , id = idOrDoneIsDone ? paths.join('') : idOrDone
	      , queue = paths.length
	    function loopFn(item) {
	      return item.call ? item() : list[item]
	    }
	    function callback() {
	      if (!--queue) {
	        list[id] = 1
	        done && done()
	        for (var dset in delay) {
	          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
	        }
	      }
	    }
	    setTimeout(function () {
	      each(paths, function loading(path, force) {
	        if (path === null) return callback()
	        
	        if (!force && !/^https?:\/\//.test(path) && scriptpath) {
	          path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
	        }
	        
	        if (scripts[path]) {
	          if (id) ids[id] = 1
	          return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
	        }

	        scripts[path] = 1
	        if (id) ids[id] = 1
	        create(path, callback)
	      })
	    }, 0)
	    return $script
	  }

	  function create(path, fn) {
	    var el = doc.createElement('script'), loaded
	    el.onload = el.onerror = el[onreadystatechange] = function () {
	      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
	      el.onload = el[onreadystatechange] = null
	      loaded = 1
	      scripts[path] = 2
	      fn()
	    }
	    el.async = 1
	    el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
	    head.insertBefore(el, head.lastChild)
	  }

	  $script.get = create

	  $script.order = function (scripts, id, done) {
	    (function callback(s) {
	      s = scripts.shift()
	      !scripts.length ? $script(s, id, done) : $script(s, callback)
	    }())
	  }

	  $script.path = function (p) {
	    scriptpath = p
	  }
	  $script.urlArgs = function (str) {
	    urlArgs = str;
	  }
	  $script.ready = function (deps, ready, req) {
	    deps = deps[push] ? deps : [deps]
	    var missing = [];
	    !each(deps, function (dep) {
	      list[dep] || missing[push](dep);
	    }) && every(deps, function (dep) {return list[dep]}) ?
	      ready() : !function (key) {
	      delay[key] = delay[key] || []
	      delay[key][push](ready)
	      req && req(missing)
	    }(deps.join('|'))
	    return $script
	  }

	  $script.done = function (idOrDone) {
	    $script([null], idOrDone)
	  }

	  return $script
	});


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_25__;

/***/ }
/******/ ])
});
;