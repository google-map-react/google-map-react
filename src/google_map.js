import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import MarkerDispatcher from './marker_dispatcher.js';

import GoogleMapMap from './google_map_map.js';
import GoogleMapMarkers from './google_map_markers.js';
import GoogleMapMarkersPrerender from './google_map_markers_prerender.js';

import googleMapLoader from './utils/loaders/google_map_loader.js';
import detectBrowser from './utils/detect.js';

import Geo from './utils/geo.js';
import isArraysEqualEps from './utils/array_helper.js';

import isFunction from 'lodash.isfunction';
import isPlainObject from 'lodash.isplainobject';
import pick from 'lodash.pick';

const kEPS = 0.00001;
const K_GOOGLE_TILE_SIZE = 256;

function defaultOptions_(/*maps*/) {
  return {
    overviewMapControl: false,
    streetViewControl: false,
    rotateControl: true,
    mapTypeControl: false,
    // disable poi
    styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }]}],
    minZoom: 3 // i need to dynamically calculate possible zoom value
  };
}

const style = {
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  position: 'relative'
};


function isNumber(n) {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}


export default class GoogleMap extends Component {

  static propTypes = {
    apiKey: PropTypes.string,
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    onBoundsChange: PropTypes.func,
    onChildClick: PropTypes.func,
    onChildMouseEnter: PropTypes.func,
    onChildMouseLeave: PropTypes.func,
    options: PropTypes.any,
    distanceToMouse: PropTypes.func,
    hoverDistance: PropTypes.number,
    debounced: PropTypes.bool,
    margin: PropTypes.array,
    googleMapLoader: PropTypes.any
  };

  static defaultProps = {
    distanceToMouse(pt, mousePos /*, markerProps*/) {
      const x = pt.x;
      const y = pt.y; // - 20;
      return Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
    },
    hoverDistance: 30,
    debounced: true,
    options: defaultOptions_,
    googleMapLoader
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

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
    if (this._isCenterDefined(this.props.center)) {
      this.geoService_.setView(this.props.center, this.props.zoom, 0);
    }

    this.state = {
      overlayCreated: false
    };
  }


  _initMap = () => {
    const center = this.props.center;
    this.geoService_.setView(center, this.props.zoom, 0);

    this._onBoundsChanged(); // now we can calculate map bounds center etc...

    this.props.googleMapLoader(this.props.apiKey)
    .then(maps => {
      if (!this.mounted_) {
        return;
      }

      const centerLatLng = this.geoService_.getCenter();

      const propsOptions = {
        zoom: this.props.zoom,
        center: new maps.LatLng(centerLatLng.lat, centerLatLng.lng)
      };

      // prevent to exapose full api
      // next props must be exposed (console.log(Object.keys(pick(maps, isPlainObject))))
      // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
      // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
      // "event", "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
      // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
      // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
      const mapPlainObjects = pick(maps, isPlainObject);
      const options = isFunction(this.props.options) ? this.props.options(mapPlainObjects) : this.props.options;
      const defaultOptions = defaultOptions_(mapPlainObjects);

      const mapOptions = {...defaultOptions, ...options, ...propsOptions};

      const map = new maps.Map(React.findDOMNode(this.refs.google_map_dom), mapOptions);
      this.map_ = map;
      this.maps_ = maps;

      // render in overlay
      const this_ = this;
      const overlay = Object.assign(new maps.OverlayView(), {
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

          React.render((
            <GoogleMapMarkers
              onChildClick={this_._onChildClick}
              onChildMouseEnter={this_._onChildMouseEnter}
              onChildMouseLeave={this_._onChildMouseLeave}
              geoService={this_.geoService_}
              projectFromLeftTop={true}
              distanceToMouse={this_.props.distanceToMouse}
              hoverDistance={this_.props.hoverDistance}
              dispatcher={this_.markersDispatcher_} />),
            div,
            () => {
              // remove prerendered markers
              this_.setState({overlayCreated: true});
            }
          );
        },

        draw() {
          const div = overlay.div;
          const overlayProjection = overlay.getProjection();
          const bounds = map.getBounds();
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));

          // need round for safari still can't find what need for firefox
          const ptxRounded = detectBrowser().isSafari ? {x: Math.round(ptx.x), y: Math.round(ptx.y)} : {x: ptx.x, y: ptx.y};

          this_.updateCounter_++;
          this_._onBoundsChanged(map, maps, !this_.props.debounced);

          div.style.left = `${ptxRounded.x}px`;
          div.style.top = `${ptxRounded.y}px`;
          if (this_.markersDispatcher_) {
            this_.markersDispatcher_.emit('kON_CHANGE');
          }
        }
      });

      overlay.setMap(map);

      maps.event.addListener(map, 'idle', () => {
        if (this.resetSizeOnIdle_) {
          this._setViewSize();
          this.resetSizeOnIdle_ = false;
        }

        const div = overlay.div;
        const overlayProjection = overlay.getProjection();
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));
        // need round for safari still can't find what need for firefox
        const ptxRounded = detectBrowser().isSafari ? {x: Math.round(ptx.x), y: Math.round(ptx.y)} : {x: ptx.x, y: ptx.y};

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
      });
    })
    .catch( e => {
      console.error(e); // eslint-disable-line no-console
      throw e;
    });
  }

  _onChildClick = (...args) => {
    if (this.props.onChildClick) {
      return this.props.onChildClick(...args);
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
    const mapDom = React.findDOMNode(this.refs.google_map_dom);
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

    if (this.props.onBoundsChange && this.geoService_.canProject()) {
      const zoom = this.geoService_.getZoom();
      const bounds = this.geoService_.getBounds();
      const centerLatLng = this.geoService_.getCenter();

      if (!isArraysEqualEps(bounds, this.prevBounds_, kEPS)) {
        if (callExtBoundsChange !== false) {
          const marginBounds = this.geoService_.getBounds(this.props.margin);
          this.props.onBoundsChange([centerLatLng.lat, centerLatLng.lng], zoom, bounds, marginBounds);
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

          if (!isArraysEqualEps([centerLatLng.lat, centerLatLng.lng], [gmC.lat(), gmC.lng()], kEPS)) {
            console.info('GoogleMap center not eq:', [centerLatLng.lat, centerLatLng.lng], [gmC.lat(), gmC.lng()]); // eslint-disable-line no-console
          }

          if (!isArraysEqualEps(bounds, [ne.lat(), sw.lng(), sw.lat(), ne.lng()], kEPS)) {
            // this is normal if this message occured on resize
            console.info('GoogleMap bounds not eq:', '\n', bounds, '\n', [ne.lat(), sw.lng(), sw.lat(), ne.lng()]); // eslint-disable-line no-console
          }
        }
      }
    }
  }

  _onMouseMove = (e) => {
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

  _onMapClick = () => {
    if (this.markersDispatcher_) {
      const K_IDLE_TIMEOUT = 100;
      const currTime = (new Date()).getTime();
      if (currTime - this.dragTime_ > K_IDLE_TIMEOUT) {
        this.markersDispatcher_.emit('kON_CLICK');
      }
    }
  }

  _isCenterDefined = (center) => {
    return center && center.length === 2 && isNumber(center[0]) && isNumber(center[1]);
  }

  componentDidMount() {
    this.mounted_ = true;
    window.addEventListener('resize', this._onWindowResize);

    setTimeout(() => { // to detect size
      this._setViewSize();
      if (this._isCenterDefined(this.props.center)) {
        this._initMap();
      } else {
        this.props.googleMapLoader(this.props.apiKey); // начать подгружать можно уже сейчас
      }
    }, 0, this);
  }

  componentWillUnmount() {
    this.mounted_ = false;

    window.removeEventListener('resize', this._onWindowResize);

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

  componentWillReceiveProps(nextProps) {
    if (!this._isCenterDefined(this.props.center) && this._isCenterDefined(nextProps.center)) {
      setTimeout(() =>
        this._initMap(), 0);
    }

    if (this.map_) {
      const centerLatLng = this.geoService_.getCenter();
      if (nextProps.center) {
        if (Math.abs(nextProps.center[0] - centerLatLng.lat) + Math.abs(nextProps.center[1] - centerLatLng.lng) > kEPS) {
          this.map_.panTo({lat: nextProps.center[0], lng: nextProps.center[1]});
        }
      }

      // if zoom chaged by user
      if (Math.abs(nextProps.zoom - this.props.zoom) > 0) {
        this.map_.setZoom(nextProps.zoom);
      }
    }
  }

  componentDidUpdate() {
    this.markersDispatcher_.emit('kON_CHANGE');
  }

  render() {
    const mapMarkerPrerender = !this.state.overlayCreated ? (
      <GoogleMapMarkersPrerender
        onChildClick={this._onChildClick}
        onChildMouseEnter={this._onChildMouseEnter}
        onChildMouseLeave={this._onChildMouseLeave}
        geoService={this.geoService_}
        projectFromLeftTop={false}
        distanceToMouse={this.props.distanceToMouse}
        hoverDistance={this.props.hoverDistance}
        dispatcher={this.markersDispatcher_} />
    ) : null;

    return (
      <div style={style} onMouseMove={this._onMouseMove} onClick={this._onMapClick}>
        <GoogleMapMap ref="google_map_dom" />

        {/*render markers before map load done*/}
        {mapMarkerPrerender}
      </div>
    );
  }
}
