import React, {PropTypes, Component} from 'react';
import { isReact14 } from './utils/react_version';

import shouldPureComponentUpdate from 'react-pure-render/function';

import MarkerDispatcher from './marker_dispatcher';

import GoogleMapMap from './google_map_map';
import GoogleMapMarkers from './google_map_markers';
import GoogleMapMarkersPrerender from './google_map_markers_prerender';

import googleMapLoader from './utils/loaders/google_map_loader';
import detectBrowser from './utils/detect';

import Geo from './utils/geo';
import isArraysEqualEps from './utils/array_helper';

import isPlainObject from './utils/is_plain_object';
import pick from './utils/pick';
import raf from './utils/raf';

import assign from 'lodash/object/assign';
import isNumber from 'lodash/lang/isNumber';

// To avoid Error with React 13, webpack will generate warning not error
// more details is here https://github.com/orgsync/react-list/pull/54
let ReactDOM;
if (isReact14(React)) {
  try {
    ReactDOM = require('react-dom');
  } catch (e) {
    ReactDOM = React;
  }
} else {
  ReactDOM = React;
}


const kEPS = 0.00001;
const K_GOOGLE_TILE_SIZE = 256;
// real minZoom calculated here _getMinZoom
const DEFAULT_MIN_ZOOM = 3;

function defaultOptions_(/* maps */) {
  return {
    overviewMapControl: false,
    streetViewControl: false,
    rotateControl: true,
    mapTypeControl: false,
    // disable poi
    styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }]}],
    minZoom: DEFAULT_MIN_ZOOM, // dynamically recalculted if possible during init
  };
}

const style = {
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  position: 'relative',
};

const latLng2Obj = (latLng) => isPlainObject(latLng)
    ? latLng
    : {lat: latLng[0], lng: latLng[1]};

export default class GoogleMap extends Component {

  static propTypes = {
    apiKey: PropTypes.string,
    defaultCenter: React.PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    ]),
    center: React.PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    ]),
    defaultZoom: PropTypes.number,
    zoom: PropTypes.number,
    onBoundsChange: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onChildClick: PropTypes.func,
    onChildMouseDown: PropTypes.func,
    onChildMouseUp: PropTypes.func,
    onChildMouseEnter: PropTypes.func,
    onChildMouseLeave: PropTypes.func,
    onZoomAnimationStart: PropTypes.func,
    onZoomAnimationEnd: PropTypes.func,
    onDrag: PropTypes.func,
    options: PropTypes.any,
    distanceToMouse: PropTypes.func,
    hoverDistance: PropTypes.number,
    debounced: PropTypes.bool,
    margin: PropTypes.array,
    googleMapLoader: PropTypes.any,
    onGoogleApiLoaded: PropTypes.func,
    yesIWantToUseGoogleMapApiInternals: PropTypes.bool,
    draggable: PropTypes.bool,
  };

  static defaultProps = {
    distanceToMouse(pt, mousePos /* , markerProps */) {
      return Math.sqrt(
        (pt.x - mousePos.x) * (pt.x - mousePos.x) + (pt.y - mousePos.y) * (pt.y - mousePos.y)
      );
    },
    hoverDistance: 30,
    debounced: true,
    options: defaultOptions_,
    googleMapLoader,
    yesIWantToUseGoogleMapApiInternals: false,
  };

  constructor(props) {
    super(props);
    this.mounted_ = false;

    this.map_ = null;
    this.maps_ = null;
    this.prevBounds_ = null;

    this.mouse_ = null;
    this.mouseMoveTime_ = 0;
    this.boundingRect_ = null;
    this.mouseInMap_ = true;

    this.dragTime_ = 0;
    this.fireMouseEventOnIdle_ = false;
    this.updateCounter_ = 0;

    this.markersDispatcher_ = new MarkerDispatcher(this);
    this.geoService_ = new Geo(K_GOOGLE_TILE_SIZE);
    this.centerIsObject_ = isPlainObject(this.props.center);

    this.minZoom_ = DEFAULT_MIN_ZOOM;
    this.defaultDraggableOption_ = true;

    this.zoomControlClickTime_ = 0;

    this.childMouseDownArgs_ = null;

    if (process.env.NODE_ENV !== 'production') {
      if (this.props.onBoundsChange) {
        console.warn( 'GoogleMap: ' +  // eslint-disable-line no-console
                      'onBoundsChange is deprecated, use ' +
                      'onChange({center, zoom, bounds, ...other}) instead.');
      }

      if (this.props.center === undefined && this.props.defaultCenter === undefined) {
        console.warn( 'GoogleMap: center or defaultCenter' +  // eslint-disable-line no-console
                      'property must be defined');
      }

      if (this.props.zoom === undefined && this.props.defaultZoom === undefined) {
        console.warn( 'GoogleMap: zoom or defaultZoom' + // eslint-disable-line no-console
                      'property must be defined');
      }
    }

    if (this._isCenterDefined(this.props.center || this.props.defaultCenter)) {
      const propsCenter = latLng2Obj(this.props.center || this.props.defaultCenter);
      this.geoService_.setView(propsCenter, this.props.zoom || this.props.defaultZoom, 0);
    }

    this.zoomAnimationInProgress_ = false;

    this.state = {
      overlayCreated: false,
    };
  }

  componentDidMount() {
    this.mounted_ = true;
    window.addEventListener('resize', this._onWindowResize);
    window.addEventListener('keydown', this._onKeyDownCapture, true);

    // gmap can't prevent map drag if mousedown event already occured
    // the only workaround I find is prevent mousedown native browser event
    ReactDOM.findDOMNode(this.refs.google_map_dom)
      .addEventListener('mousedown', this._onMapMouseDownNative, true);

    window.addEventListener('mouseup', this._onChildMouseUp, false);

    this.props.googleMapLoader(this.props.apiKey); // we can start load immediatly

    setTimeout(() => { // to detect size
      this._setViewSize();
      if (this._isCenterDefined(this.props.center || this.props.defaultCenter)) {
        this._initMap();
      }
    }, 0, this);
  }


  componentWillReceiveProps(nextProps) {
    if (process.env.NODE_ENV !== 'production') {
      if (this.props.defaultCenter !== nextProps.defaultCenter) {
        console.warn('GoogleMap: defaultCenter prop changed. ' +  // eslint-disable-line
                      'You can\'t change default props.');
      }

      if (this.props.defaultZoom !== nextProps.defaultZoom) {
        console.warn('GoogleMap: defaultZoom prop changed. ' +  // eslint-disable-line
                      'You can\'t change default props.');
      }
    }

    if (!this._isCenterDefined(this.props.center) && this._isCenterDefined(nextProps.center)) {
      setTimeout(() =>
        this._initMap(), 0);
    }

    if (this.map_) {
      const centerLatLng = this.geoService_.getCenter();
      if (nextProps.center) {
        const nextPropsCenter = latLng2Obj(nextProps.center);
        if (Math.abs(nextPropsCenter.lat - centerLatLng.lat) +
            Math.abs(nextPropsCenter.lng - centerLatLng.lng) > kEPS) {
          this.map_.panTo({lat: nextPropsCenter.lat, lng: nextPropsCenter.lng});
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
        this.map_.setOptions({draggable: this.defaultDraggableOption_});
      } else if (this.props.draggable !== nextProps.draggable) {
        // also prevent this on window 'mousedown' event to prevent map move
        this.map_.setOptions({draggable: nextProps.draggable});
      }
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidUpdate(prevProps) {
    this.markersDispatcher_.emit('kON_CHANGE');

    if (this.props.hoverDistance !== prevProps.hoverDistance) {
      this.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
    }
  }

  componentWillUnmount() {
    this.mounted_ = false;

    window.removeEventListener('resize', this._onWindowResize);
    window.removeEventListener('keydown', this._onKeyDownCapture);
    ReactDOM.findDOMNode(this.refs.google_map_dom)
      .removeEventListener('mousedown', this._onMapMouseDownNative, true);
    window.removeEventListener('mouseup', this._onChildMouseUp, false);

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
  _getMinZoom = () => {
    if (this.geoService_.getWidth() > 0 || this.geoService_.getHeight() > 0) {
      const tilesPerWidth = Math.ceil(this.geoService_.getWidth() / K_GOOGLE_TILE_SIZE) + 2;
      const tilesPerHeight = Math.ceil(this.geoService_.getHeight() / K_GOOGLE_TILE_SIZE) + 2;
      const maxTilesPerDim = Math.max(tilesPerWidth, tilesPerHeight);
      return Math.ceil(Math.log2(maxTilesPerDim));
    }
    return DEFAULT_MIN_ZOOM;
  }

  _initMap = () => {
    const propsCenter = latLng2Obj(this.props.center || this.props.defaultCenter);
    this.geoService_.setView(propsCenter, this.props.zoom || this.props.defaultZoom, 0);

    this._onBoundsChanged(); // now we can calculate map bounds center etc...

    this.props.googleMapLoader(this.props.apiKey)
    .then(maps => {
      if (!this.mounted_) {
        return;
      }

      const centerLatLng = this.geoService_.getCenter();

      const propsOptions = {
        zoom: this.props.zoom || this.props.defaultZoom,
        center: new maps.LatLng(centerLatLng.lat, centerLatLng.lng),
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
      const mapPlainObjects = pick(maps, isPlainObject);
      const options = typeof this.props.options === 'function'
        ? this.props.options(mapPlainObjects)
        : this.props.options;
      const defaultOptions = defaultOptions_(mapPlainObjects);

      const draggableOptions = this.props.draggable !== undefined &&
        {draggable: this.props.draggable};

      const minZoom = this._getMinZoom();
      this.minZoom_ = minZoom;

      const preMapOptions = {
        ...defaultOptions,
        minZoom,
        ...options,
        ...propsOptions,
      };

      this.defaultDraggableOption_ = preMapOptions.draggable !== undefined
        ? preMapOptions.draggable
        : this.defaultDraggableOption_;

      const mapOptions = {
        ...preMapOptions,
        ...draggableOptions,
      };

      if (process.env.NODE_ENV !== 'production') {
        if (mapOptions.minZoom < minZoom) {
          console.warn( 'GoogleMap: ' + // eslint-disable-line
                        'minZoom option is less than recommended ' +
                        'minZoom option for your map sizes.\n' +
                        'overrided to value ' + minZoom);
        }
      }

      if (mapOptions.minZoom < minZoom) {
        mapOptions.minZoom = minZoom;
      }

      const map = new maps.Map(ReactDOM.findDOMNode(this.refs.google_map_dom), mapOptions);
      this.map_ = map;
      this.maps_ = maps;

      // render in overlay
      const this_ = this;
      const overlay = this.overlay_ = assign(new maps.OverlayView(), {
        onAdd() {
          const K_MAX_WIDTH = (typeof screen !== 'undefined') ? `${screen.width}px` : '2000px';
          const K_MAX_HEIGHT = (typeof screen !== 'undefined') ? `${screen.height}px` : '2000px';

          const div = document.createElement('div');
          this.div = div;
          div.style.backgroundColor = 'transparent';
          div.style.position = 'absolute';
          div.style.left = '0px';
          div.style.top = '0px';
          div.style.width = K_MAX_WIDTH; // prevents some chrome draw defects
          div.style.height = K_MAX_HEIGHT;

          const panes = this.getPanes();
          panes.overlayMouseTarget.appendChild(div);

          ReactDOM.render((
            <GoogleMapMarkers
              onChildClick={this_._onChildClick}
              onChildMouseDown={this_._onChildMouseDown}
              onChildMouseEnter={this_._onChildMouseEnter}
              onChildMouseLeave={this_._onChildMouseLeave}
              geoService={this_.geoService_}
              projectFromLeftTop
              distanceToMouse={this_.props.distanceToMouse}
              getHoverDistance={this_._getHoverDistance}
              dispatcher={this_.markersDispatcher_} />),
            div,
            // remove prerendered markers
            () => this_.setState({overlayCreated: true}),
          );
        },

        onRemove() {
          ReactDOM.unmountComponentAtNode(this.div);
        },

        draw() {
          const div = overlay.div;
          const overlayProjection = overlay.getProjection();
          const bounds = map.getBounds();
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));

          // need round for safari still can't find what need for firefox
          const ptxRounded = detectBrowser().isSafari
            ? {x: Math.round(ptx.x), y: Math.round(ptx.y)}
            : {x: ptx.x, y: ptx.y};

          this_.updateCounter_++;
          this_._onBoundsChanged(map, maps, !this_.props.debounced);

          this_._onGoogleApiLoaded({map, maps});

          div.style.left = `${ptxRounded.x}px`;
          div.style.top = `${ptxRounded.y}px`;
          if (this_.markersDispatcher_) {
            this_.markersDispatcher_.emit('kON_CHANGE');
          }
        },
      });

      overlay.setMap(map);

      maps.event.addListener(map, 'zoom_changed', () => {
        // recalc position at zoom start
        if (this_.geoService_.getZoom() !== map.getZoom()) {
          if (!this_.zoomAnimationInProgress_) {
            this_.zoomAnimationInProgress_ = true;
            this_._onZoomAnimationStart();
          }

          const TIMEOUT_ZOOM = 300;

          if ((new Date()).getTime() - this.zoomControlClickTime_ < TIMEOUT_ZOOM) {
            // there is strange Google Map Api behavior in chrome when zoom animation of map
            // is started only on second raf call, if was click on zoom control
            // or +- keys pressed, so i wait for two rafs before change state

            // this does not fully prevent animation jump
            // but reduce it's occurence probability
            raf(() => raf(() => {
              this_.updateCounter_++;
              this_._onBoundsChanged(map, maps);
            }));
          } else {
            this_.updateCounter_++;
            this_._onBoundsChanged(map, maps);
          }
        }
      });

      maps.event.addListener(map, 'idle', () => {
        if (this.resetSizeOnIdle_) {
          this._setViewSize();
          const currMinZoom = this._getMinZoom();

          if (currMinZoom !== this.minZoom_) {
            this.minZoom_ = currMinZoom;
            map.setOptions({minZoom: currMinZoom});
          }

          this.resetSizeOnIdle_ = false;
        }

        if (this_.zoomAnimationInProgress_) {
          this_.zoomAnimationInProgress_ = false;
          this_._onZoomAnimationEnd();
        }

        const div = overlay.div;
        const overlayProjection = overlay.getProjection();
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));
        // need round for safari still can't find what need for firefox
        const ptxRounded = detectBrowser().isSafari
          ? {x: Math.round(ptx.x), y: Math.round(ptx.y)}
          : {x: ptx.x, y: ptx.y};

        this_.updateCounter_++;
        this_._onBoundsChanged(map, maps);

        this_.dragTime_ = 0;
        div.style.left = `${ptxRounded.x}px`;
        div.style.top = `${ptxRounded.y}px`;
        if (this_.markersDispatcher_) {
          this_.markersDispatcher_.emit('kON_CHANGE');
          if (this_.fireMouseEventOnIdle_) {
            this_.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
          }
        }
      });

      maps.event.addListener(map, 'mouseover', () => { // has advantage over div MouseLeave
        this_.mouseInMap_ = true;
      });

      maps.event.addListener(map, 'mouseout', () => { // has advantage over div MouseLeave
        this_.mouseInMap_ = false;
        this_.mouse_ = null;
        this_.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
      });

      maps.event.addListener(map, 'drag', () => {
        this_.dragTime_ = (new Date()).getTime();
        this_._onDrag();
      });
    })
    .catch( e => {
      console.error(e); // eslint-disable-line no-console
      throw e;
    });
  }

  _onGoogleApiLoaded = (...args) => {
    if (this.props.onGoogleApiLoaded) {
      if (process.env.NODE_ENV !== 'production' &&
          this.props.yesIWantToUseGoogleMapApiInternals !== true ) {
        console.warn( 'GoogleMap: ' + // eslint-disable-line
                      'Usage of internal api objects is dangerous ' +
                      'and can cause a lot of issues.\n' +
                      'To hide this warning add yesIWantToUseGoogleMapApiInternals={true} ' +
                      'to <GoogleMap instance');
      }

      this.props.onGoogleApiLoaded(...args);
    }
  }

  _getHoverDistance = () => {
    return this.props.hoverDistance;
  }

  _onDrag = (...args) => this.props.onDrag &&
    this.props.onDrag(...args);

  _onZoomAnimationStart = (...args) => this.props.onZoomAnimationStart &&
    this.props.onZoomAnimationStart(...args)

  _onZoomAnimationEnd = (...args) => this.props.onZoomAnimationEnd &&
    this.props.onZoomAnimationEnd(...args)

  _onChildClick = (...args) => {
    if (this.props.onChildClick) {
      return this.props.onChildClick(...args);
    }
  }

  _onChildMouseDown = (hoverKey, childProps, event) => {
    if (this.props.onChildMouseDown) {
      this.childMouseDownArgs_ = [hoverKey, childProps];
      return this.props.onChildMouseDown(hoverKey, childProps, event);
    }
  }

  // this method works only if this.props.onChildMouseDown was called
  _onChildMouseUp = (...args) => {
    if (this.childMouseDownArgs_) {
      if (this.props.onChildMouseUp) {
        return this.props.onChildMouseUp(...this.childMouseDownArgs_, ...args);
      }

      this.childMouseDownArgs_ = null;
    }
  }

  _onChildMouseEnter = (...args) => {
    if (this.props.onChildMouseEnter) {
      return this.props.onChildMouseEnter(...args);
    }
  }

  _onChildMouseLeave = (...args) => {
    if (this.props.onChildMouseLeave) {
      return this.props.onChildMouseLeave(...args);
    }
  }

  _setViewSize = () => {
    const mapDom = ReactDOM.findDOMNode(this.refs.google_map_dom);
    this.geoService_.setViewSize(mapDom.clientWidth, mapDom.clientHeight);
    this._onBoundsChanged();
  }

  _onWindowResize = () => {
    this.resetSizeOnIdle_ = true;
  }

  _onBoundsChanged = (map, maps, callExtBoundsChange) => {
    if (map) {
      const gmC = map.getCenter();
      this.geoService_.setView([gmC.lat(), gmC.lng()], map.getZoom(), 0);
    }

    if ((this.props.onChange || this.props.onBoundsChange) && this.geoService_.canProject()) {
      const zoom = this.geoService_.getZoom();
      const bounds = this.geoService_.getBounds();
      const centerLatLng = this.geoService_.getCenter();

      if (!isArraysEqualEps(bounds, this.prevBounds_, kEPS)) {
        if (callExtBoundsChange !== false) {
          const marginBounds = this.geoService_.getBounds(this.props.margin);
          if (this.props.onBoundsChange) {
            this.props.onBoundsChange(
              this.centerIsObject_
                ? {...centerLatLng}
                : [centerLatLng.lat, centerLatLng.lng],
              zoom,
              bounds,
              marginBounds
            );
          }

          if (this.props.onChange) {
            this.props.onChange({
              center: {...centerLatLng},
              zoom,
              bounds: {
                nw: {
                  lat: bounds[0],
                  lng: bounds[1],
                },
                se: {
                  lat: bounds[2],
                  lng: bounds[3],
                },
              },
              marginBounds: {
                nw: {
                  lat: marginBounds[0],
                  lng: marginBounds[1],
                },
                se: {
                  lat: marginBounds[2],
                  lng: marginBounds[3],
                },
              },

              size: this.geoService_.hasSize()
                ? {
                  width: this.geoService_.getWidth(),
                  height: this.geoService_.getHeight(),
                }
                : {
                  width: 0,
                  height: 0,
                },
            });
          }

          this.prevBounds_ = bounds;
        }
      }
      // uncomment for strange bugs
      if (process.env.NODE_ENV !== 'production') { // compare with google calculations
        if (map) {
          const locBounds = map.getBounds();
          const ne = locBounds.getNorthEast();
          const sw = locBounds.getSouthWest();

          const gmC = map.getCenter();
          // compare with google map

          if (!isArraysEqualEps(
              [centerLatLng.lat, centerLatLng.lng],
              [gmC.lat(), gmC.lng()], kEPS
              )) {
            console.info('GoogleMap center not eq:',  // eslint-disable-line no-console
              [centerLatLng.lat, centerLatLng.lng], [gmC.lat(), gmC.lng()]);
          }

          if (!isArraysEqualEps(bounds, [ne.lat(), sw.lng(), sw.lat(), ne.lng()], kEPS)) {
            // this is normal if this message occured on resize
            console.info('GoogleMap bounds not eq:', '\n',  // eslint-disable-line no-console
              bounds, '\n', [ne.lat(), sw.lng(), sw.lat(), ne.lng()]);
          }
        }
      }
    }
  }

  _onMapMouseMove = (e) => {
    if (!this.mouseInMap_) return;

    const currTime = (new Date()).getTime();
    const K_RECALC_CLIENT_RECT_MS = 3000;

    if (currTime - this.mouseMoveTime_ > K_RECALC_CLIENT_RECT_MS) {
      this.boundingRect_ = e.currentTarget.getBoundingClientRect();
    }
    this.mouseMoveTime_ = currTime;

    const mousePosX = e.clientX - this.boundingRect_.left;
    const mousePosY = e.clientY - this.boundingRect_.top;

    if (!this.mouse_) {
      this.mouse_ = {x: 0, y: 0, lat: 0, lng: 0};
    }
    const K_IDLE_TIMEOUT = 100;

    this.mouse_.x = mousePosX;
    this.mouse_.y = mousePosY;

    const latLng = this.geoService_.unproject(this.mouse_, true);
    this.mouse_.lat = latLng.lat;
    this.mouse_.lng = latLng.lng;

    if (currTime - this.dragTime_ < K_IDLE_TIMEOUT) {
      this.fireMouseEventOnIdle_ = true;
    } else {
      this.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
      this.fireMouseEventOnIdle_ = false;
    }
  }

  _onClick = (...args) => this.props.onClick &&
    this.props.onClick(...args)

  _onMapClick = (event) => {
    if (this.markersDispatcher_) {
      const K_IDLE_TIMEOUT = 100;
      const currTime = (new Date()).getTime();
      if (currTime - this.dragTime_ > K_IDLE_TIMEOUT) {
        this._onClick({
          ...this.mouse_,
          event,
        });

        this.markersDispatcher_.emit('kON_CLICK', event);
      }
    }
  }

  // gmap can't prevent map drag if mousedown event already occured
  // the only workaround I find is prevent mousedown native browser event
  _onMapMouseDownNative = (event) => {
    if (!this.mouseInMap_) return;

    this._onMapMouseDown(event);
    if (this.props.draggable === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  _onMapMouseDown = (event) => {
    if (this.markersDispatcher_) {
      const K_IDLE_TIMEOUT = 100;
      const currTime = (new Date()).getTime();
      if (currTime - this.dragTime_ > K_IDLE_TIMEOUT) {
        this.markersDispatcher_.emit('kON_MDOWN', event);
      }
    }
  }

  _onMapMouseDownCapture = (event) => {
    if (detectBrowser().isChrome) {
      // to fix strange zoom in chrome
      if (event.target !== undefined) {
        let res = 0;
        let curr = event.target;
        while (curr) {
          if (curr && curr.getAttribute) {
            if (curr.getAttribute('title')) {
              res += 10;
            }

            if (curr.getAttribute('class') === 'gmnoprint') {
              res *= 10;
            }
          }
          curr = curr.parentNode;
        }

        if (res === 1000) {
          this.zoomControlClickTime_ = (new Date()).getTime();
        }
      }
    }
  }

  _onKeyDownCapture = () => {
    if (detectBrowser().isChrome) {
      this.zoomControlClickTime_ = (new Date()).getTime();
    }
  }

  _isCenterDefined = (center) => center && (
    (isPlainObject(center) && isNumber(center.lat) && isNumber(center.lng)) ||
    (center.length === 2 && isNumber(center[0]) && isNumber(center[1]))
  )

  render() {
    const mapMarkerPrerender = !this.state.overlayCreated ? (
      <GoogleMapMarkersPrerender
        onChildClick={this._onChildClick}
        onChildMouseDown={this._onChildMouseDown}
        onChildMouseEnter={this._onChildMouseEnter}
        onChildMouseLeave={this._onChildMouseLeave}
        geoService={this.geoService_}
        projectFromLeftTop={false}
        distanceToMouse={this.props.distanceToMouse}
        getHoverDistance={this._getHoverDistance}
        dispatcher={this.markersDispatcher_} />
    ) : null;

    return (
      <div
        style={style}
        onMouseMove={this._onMapMouseMove}
        onMouseDownCapture={this._onMapMouseDownCapture}
        onClick={this._onMapClick}
      >
        <GoogleMapMap ref="google_map_dom" />

        {/* render markers before map load done */}
        {mapMarkerPrerender}
      </div>
    );
  }
}

