/* eslint-disable import/no-extraneous-dependencies, react/forbid-prop-types, react/no-find-dom-node, no-console, no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

// helpers
import GoogleMapMap from './google_map_map';
import MarkerDispatcher from './marker_dispatcher';
import GoogleMapMarkers from './google_map_markers';
import GoogleMapMarkersPrerender from './google_map_markers_prerender';
import { generateHeatmap, optionsHeatmap } from './google_heatmap';

// loaders
import googleMapLoader from './loaders/google_map_loader';

// lib
import Geo from './lib/geo';

// tools
import raf from './utils/raf';
import log2 from './utils/log2';
import omit from './utils/omit';
import pick from './utils/pick';
import isEmpty from './utils/isEmpty';
import isNumber from './utils/isNumber';
import detectBrowser from './utils/detect';
import shallowEqual from './utils/shallowEqual';
import isPlainObject from './utils/isPlainObject';
import isArraysEqualEps from './utils/isArraysEqualEps';
import {
  addResizeListener,
  removeResizeListener,
} from './utils/detectElementResize';
import addPassiveEventListener from './utils/passiveEvents';

// consts
const kEPS = 0.00001;
const K_GOOGLE_TILE_SIZE = 256;
// real minZoom calculated here _getMinZoom
const K_IDLE_TIMEOUT = 100;
const K_IDLE_CLICK_TIMEOUT = 300;
const DEFAULT_MIN_ZOOM = 3;
// Starting with version 3.32, the maps API calls `draw()` each frame during
// a zoom animation.
const DRAW_CALLED_DURING_ANIMATION_VERSION = 32;
const IS_REACT_16 = ReactDOM.createPortal !== undefined;

const createPortal = IS_REACT_16
  ? ReactDOM.createPortal
  : ReactDOM.unstable_renderSubtreeIntoContainer;

function defaultOptions_(/* maps */) {
  return {
    overviewMapControl: false,
    streetViewControl: false,
    rotateControl: true,
    mapTypeControl: false,
    // disable poi
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
    minZoom: DEFAULT_MIN_ZOOM, // dynamically recalculted if possible during init
  };
}

const latLng2Obj = (latLng) =>
  isPlainObject(latLng) ? latLng : { lat: latLng[0], lng: latLng[1] };

const _checkMinZoom = (zoom, minZoom) => {
  if (process.env.NODE_ENV !== 'production') {
    if (zoom < minZoom) {
      console.warn(
        'GoogleMap: ' + // eslint-disable-line
          'minZoom option is less than recommended ' +
          'minZoom option for your map sizes.\n' +
          'overrided to value ' +
          minZoom
      );
    }
  }

  if (minZoom < zoom) {
    return zoom;
  }
  return minZoom;
};

const isFullScreen = () =>
  document.fullscreen ||
  document.webkitIsFullScreen ||
  document.mozFullScreen ||
  document.msFullscreenElement;

class GoogleMap extends Component {
  static propTypes = {
    bootstrapURLKeys: PropTypes.any,

    defaultCenter: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    ]),
    center: PropTypes.oneOfType([
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
    onChildMouseMove: PropTypes.func,
    onChildMouseEnter: PropTypes.func,
    onChildMouseLeave: PropTypes.func,
    onZoomAnimationStart: PropTypes.func,
    onZoomAnimationEnd: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    onMapTypeIdChange: PropTypes.func,
    onTilesLoaded: PropTypes.func,
    options: PropTypes.any,
    distanceToMouse: PropTypes.func,
    hoverDistance: PropTypes.number,
    debounced: PropTypes.bool,
    margin: PropTypes.array,
    googleMapLoader: PropTypes.any,
    onGoogleApiLoaded: PropTypes.func,
    yesIWantToUseGoogleMapApiInternals: PropTypes.bool,
    draggable: PropTypes.bool,
    style: PropTypes.any,
    resetBoundsOnResize: PropTypes.bool,
    layerTypes: PropTypes.arrayOf(PropTypes.string), // ['TransitLayer', 'TrafficLayer']
    shouldUnregisterMapOnUnmount: PropTypes.bool,
  };

  static defaultProps = {
    distanceToMouse(pt, mousePos /* , markerProps */) {
      return Math.sqrt(
        (pt.x - mousePos.x) * (pt.x - mousePos.x) +
          (pt.y - mousePos.y) * (pt.y - mousePos.y)
      );
    },
    hoverDistance: 30,
    debounced: true,
    options: defaultOptions_,
    googleMapLoader,
    yesIWantToUseGoogleMapApiInternals: false,
    style: {
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      position: 'relative',
    },
    layerTypes: [],
    heatmap: {},
    shouldUnregisterMapOnUnmount: true,
  };

  static googleMapLoader = googleMapLoader; // eslint-disable-line

  constructor(props) {
    super(props);
    this.mounted_ = false;
    this.initialized_ = false;
    this.googleApiLoadedCalled_ = false;

    this.map_ = null;
    this.maps_ = null;
    this.prevBounds_ = null;
    this.heatmap = null;

    this.layers_ = {};

    this.mouse_ = null;
    this.mouseMoveTime_ = 0;
    this.boundingRect_ = null;
    this.mouseInMap_ = true;

    this.dragTime_ = 0;
    this.fireMouseEventOnIdle_ = false;
    this.updateCounter_ = 0;

    this.markersDispatcher_ = new MarkerDispatcher(this);
    this.geoService_ = new Geo(K_GOOGLE_TILE_SIZE);

    this.minZoom_ = DEFAULT_MIN_ZOOM;
    this.defaultDraggableOption_ = true;

    this.zoomControlClickTime_ = 0;

    this.childMouseDownArgs_ = null;
    this.childMouseUpTime_ = 0;

    this.googleMapDom_ = null;

    if (this._isCenterDefined(this.props.center || this.props.defaultCenter)) {
      const propsCenter = latLng2Obj(
        this.props.center || this.props.defaultCenter
      );
      this.geoService_.setView(
        propsCenter,
        this.props.zoom || this.props.defaultZoom,
        0
      );
    }

    this.zoomAnimationInProgress_ = false;

    this.state = {
      overlay: null,
    };
  }

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      if (isEmpty(this.props.center) && isEmpty(this.props.defaultCenter)) {
        console.warn(
          'GoogleMap: center or defaultCenter property must be defined' // eslint-disable-line no-console
        );
      }

      if (isEmpty(this.props.zoom) && isEmpty(this.props.defaultZoom)) {
        console.warn(
          'GoogleMap: zoom or defaultZoom property must be defined' // eslint-disable-line no-console
        );
      }
    }

    this.mounted_ = true;
    addPassiveEventListener(window, 'resize', this._onWindowResize, false);
    addPassiveEventListener(window, 'keydown', this._onKeyDownCapture, true);
    const mapDom = ReactDOM.findDOMNode(this.googleMapDom_);
    // gmap can't prevent map drag if mousedown event already occured
    // the only workaround I find is prevent mousedown native browser event

    if (mapDom) {
      addPassiveEventListener(
        mapDom,
        'mousedown',
        this._onMapMouseDownNative,
        true
      );
    }

    addPassiveEventListener(window, 'mouseup', this._onChildMouseUp, false);

    this.props.googleMapLoader(this.props.bootstrapURLKeys); // we can start load immediatly

    setTimeout(
      () => {
        // to detect size
        this._setViewSize();
        if (
          this._isCenterDefined(this.props.center || this.props.defaultCenter)
        ) {
          this._initMap();
        }
      },
      0,
      this
    );
    if (this.props.resetBoundsOnResize) {
      const that = this;
      addResizeListener(mapDom, that._mapDomResizeCallback);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // draggable does not affect inner components
    return (
      !shallowEqual(
        omit(this.props, ['draggable']),
        omit(nextProps, ['draggable'])
      ) || !shallowEqual(this.state, nextState)
    );
  }

  componentDidUpdate(prevProps) {
    if (process.env.NODE_ENV !== 'production') {
      if (!shallowEqual(prevProps.defaultCenter, this.props.defaultCenter)) {
        console.warn(
          "GoogleMap: defaultCenter prop changed. You can't change default props."
        );
      }

      if (!shallowEqual(prevProps.defaultZoom, this.props.defaultZoom)) {
        console.warn(
          "GoogleMap: defaultZoom prop changed. You can't change default props."
        );
      }
    }

    if (
      !this._isCenterDefined(prevProps.center) &&
      this._isCenterDefined(this.props.center)
    ) {
      setTimeout(() => this._initMap(), 0);
    }

    if (this.map_) {
      const centerLatLng = this.geoService_.getCenter();
      if (this._isCenterDefined(this.props.center)) {
        const currentCenter = latLng2Obj(this.props.center);
        const prevCenter = this._isCenterDefined(prevProps.center)
          ? latLng2Obj(prevProps.center)
          : null;

        if (
          !prevCenter ||
          Math.abs(currentCenter.lat - prevCenter.lat) +
            Math.abs(currentCenter.lng - prevCenter.lng) >
            kEPS
        ) {
          if (
            Math.abs(currentCenter.lat - centerLatLng.lat) +
              Math.abs(currentCenter.lng - centerLatLng.lng) >
            kEPS
          ) {
            this.map_.panTo({
              lat: currentCenter.lat,
              lng: currentCenter.lng,
            });
          }
        }
      }

      if (!isEmpty(this.props.zoom)) {
        // if zoom chaged by user
        if (Math.abs(this.props.zoom - prevProps.zoom) > 0) {
          this.map_.setZoom(this.props.zoom);
        }
      }

      if (!isEmpty(prevProps.draggable) && isEmpty(this.props.draggable)) {
        // reset to default
        this.map_.setOptions({ draggable: this.defaultDraggableOption_ });
      } else if (!shallowEqual(prevProps.draggable, this.props.draggable)) {
        // also prevent this on window 'mousedown' event to prevent map move
        this.map_.setOptions({ draggable: this.props.draggable });
      }

      // use shallowEqual to try avoid calling map._setOptions if only the ref changes
      if (
        !isEmpty(this.props.options) &&
        !shallowEqual(prevProps.options, this.props.options)
      ) {
        const mapPlainObjects = pick(this.maps_, isPlainObject);
        let options =
          typeof this.props.options === 'function'
            ? this.props.options(mapPlainObjects)
            : this.props.options;
        // remove zoom, center and draggable options as these are managed by google-maps-react
        options = omit(options, ['zoom', 'center', 'draggable']);

        if ('minZoom' in options) {
          const minZoom = this._computeMinZoom(options.minZoom);
          options.minZoom = _checkMinZoom(options.minZoom, minZoom);
        }

        this.map_.setOptions(options);
      }

      if (!shallowEqual(this.props.layerTypes, prevProps.layerTypes)) {
        Object.keys(this.layers_).forEach((layerKey) => {
          this.layers_[layerKey].setMap(null);
          delete this.layers_[layerKey];
        });
        this._setLayers(this.props.layerTypes);
      }

      if (
        this.heatmap &&
        !shallowEqual(this.props.heatmap.positions, prevProps.heatmap.positions)
      ) {
        this.heatmap.setData(
          this.props.heatmap.positions.map((p) => ({
            location: new this.maps_.LatLng(p.lat, p.lng),
            weight: p.weight,
          }))
        );
      }
      if (
        this.heatmap &&
        !shallowEqual(this.props.heatmap.options, prevProps.heatmap.options)
      ) {
        Object.keys(this.props.heatmap.options).forEach((option) => {
          this.heatmap.set(option, this.props.heatmap.options[option]);
        });
      }
    }
    // emit actions
    this.markersDispatcher_.emit('kON_CHANGE');

    if (!shallowEqual(this.props.hoverDistance, prevProps.hoverDistance)) {
      this.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
    }
  }

  componentWillUnmount() {
    this.mounted_ = false;
    const mapDom = ReactDOM.findDOMNode(this.googleMapDom_);
    if (mapDom) {
      mapDom.removeEventListener('mousedown', this._onMapMouseDownNative, true);
    }
    window.removeEventListener('resize', this._onWindowResize);
    window.removeEventListener('keydown', this._onKeyDownCapture);
    window.removeEventListener('mouseup', this._onChildMouseUp, false);
    if (this.props.resetBoundsOnResize) {
      removeResizeListener(mapDom, this._mapDomResizeCallback);
    }

    if (this.overlay_) {
      // this triggers overlay_.onRemove(), which will unmount the <GoogleMapMarkers/>
      this.overlay_.setMap(null);
    }

    if (this.maps_ && this.map_ && this.props.shouldUnregisterMapOnUnmount) {
      // fix google, as otherwise listeners works even without map
      this.map_.setOptions({ scrollwheel: false });
      this.maps_.event.clearInstanceListeners(this.map_);
    }

    if (this.props.shouldUnregisterMapOnUnmount) {
      this.map_ = null;
      this.maps_ = null;
    }
    this.markersDispatcher_.dispose();

    this.resetSizeOnIdle_ = false;

    if (this.props.shouldUnregisterMapOnUnmount) {
      delete this.map_;
      delete this.markersDispatcher_;
    }
  }

  // calc minZoom if map size available
  // it's better to not set minZoom less than this calculation gives
  // otherwise there is no homeomorphism between screen coordinates and map
  // (one map coordinate can have different screen coordinates)
  _getMinZoom = () => {
    if (this.geoService_.getWidth() > 0 || this.geoService_.getHeight() > 0) {
      const tilesPerWidth =
        Math.ceil(this.geoService_.getWidth() / K_GOOGLE_TILE_SIZE) + 2;
      const tilesPerHeight =
        Math.ceil(this.geoService_.getHeight() / K_GOOGLE_TILE_SIZE) + 2;
      const maxTilesPerDim = Math.max(tilesPerWidth, tilesPerHeight);
      return Math.ceil(log2(maxTilesPerDim));
    }
    return DEFAULT_MIN_ZOOM;
  };

  _computeMinZoom = (minZoom) => {
    if (!isEmpty(minZoom)) {
      return minZoom;
    }
    return this._getMinZoom();
  };

  _mapDomResizeCallback = () => {
    this.resetSizeOnIdle_ = true;
    if (this.maps_) {
      const originalCenter = this.props.center || this.props.defaultCenter;
      const currentCenter = this.map_.getCenter();
      this.maps_.event.trigger(this.map_, 'resize');
      this.map_.setCenter(
        this.props.resetBoundsOnResize ? originalCenter : currentCenter
      );
    }
  };

  _setLayers = (layerTypes) => {
    layerTypes.forEach((layerType) => {
      this.layers_[layerType] = new this.maps_[layerType]();
      this.layers_[layerType].setMap(this.map_);
    });
  };

  _renderPortal = () => (
    <GoogleMapMarkers
      experimental={this.props.experimental}
      onChildClick={this._onChildClick}
      onChildMouseDown={this._onChildMouseDown}
      onChildMouseEnter={this._onChildMouseEnter}
      onChildMouseLeave={this._onChildMouseLeave}
      geoService={this.geoService_}
      insideMapPanes
      distanceToMouse={this.props.distanceToMouse}
      getHoverDistance={this._getHoverDistance}
      dispatcher={this.markersDispatcher_}
    />
  );

  _initMap = () => {
    // only initialize the map once
    if (this.initialized_) {
      return;
    }
    this.initialized_ = true;

    const propsCenter = latLng2Obj(
      this.props.center || this.props.defaultCenter
    );
    this.geoService_.setView(
      propsCenter,
      this.props.zoom || this.props.defaultZoom,
      0
    );

    this._onBoundsChanged(); // now we can calculate map bounds center etc...

    this.props
      .googleMapLoader(this.props.bootstrapURLKeys)
      .then((maps) => {
        if (!this.mounted_) {
          return;
        }

        const centerLatLng = this.geoService_.getCenter();

        const propsOptions = {
          zoom: this.props.zoom || this.props.defaultZoom,
          center: new maps.LatLng(centerLatLng.lat, centerLatLng.lng),
        };

        // Start Heatmap
        if (this.props.heatmap.positions) {
          Object.assign(this, {
            heatmap: generateHeatmap(maps, this.props.heatmap),
          });
          optionsHeatmap(this.heatmap, this.props.heatmap);
        }
        // End Heatmap

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
        const options =
          typeof this.props.options === 'function'
            ? this.props.options(mapPlainObjects)
            : this.props.options;
        const defaultOptions = defaultOptions_(mapPlainObjects);

        const draggableOptions = !isEmpty(this.props.draggable) && {
          draggable: this.props.draggable,
        };

        const minZoom = this._computeMinZoom(options.minZoom);
        this.minZoom_ = minZoom;

        const preMapOptions = {
          ...defaultOptions,
          minZoom,
          ...options,
          ...propsOptions,
        };

        this.defaultDraggableOption_ = !isEmpty(preMapOptions.draggable)
          ? preMapOptions.draggable
          : this.defaultDraggableOption_;

        const mapOptions = {
          ...preMapOptions,
          ...draggableOptions,
        };

        mapOptions.minZoom = _checkMinZoom(mapOptions.minZoom, minZoom);

        const map = new maps.Map(
          ReactDOM.findDOMNode(this.googleMapDom_),
          mapOptions
        );

        this.map_ = map;
        this.maps_ = maps;

        this._setLayers(this.props.layerTypes);

        // Parse `google.maps.version` to capture the major version number.
        const versionMatch = maps.version.match(/^3\.(\d+)\./);
        // The major version is the first (and only) captured group.
        const mapsVersion = versionMatch && Number(versionMatch[1]);

        // render in overlay
        const this_ = this;
        const overlay = Object.assign(new maps.OverlayView(), {
          onAdd() {
            const K_MAX_WIDTH =
              typeof screen !== 'undefined' ? `${screen.width}px` : '2000px';
            const K_MAX_HEIGHT =
              typeof screen !== 'undefined' ? `${screen.height}px` : '2000px';

            const div = document.createElement('div');
            div.style.backgroundColor = 'transparent';
            div.style.position = 'absolute';
            div.style.left = '0px';
            div.style.top = '0px';
            div.style.width = K_MAX_WIDTH; // prevents some chrome draw defects
            div.style.height = K_MAX_HEIGHT;

            if (this_.props.overlayViewDivStyle) {
              const { overlayViewDivStyle } = this_.props;
              if (typeof overlayViewDivStyle === 'object') {
                Object.keys(overlayViewDivStyle).forEach((property) => {
                  div.style[property] = overlayViewDivStyle[property];
                });
              }
            }

            const panes = this.getPanes();
            panes.overlayMouseTarget.appendChild(div);
            this_.geoService_.setMapCanvasProjection(
              maps,
              overlay.getProjection()
            );

            if (!IS_REACT_16) {
              createPortal(
                this_,
                this_._renderPortal(),
                div,
                // remove prerendered markers
                () => this_.setState({ overlay: div })
              );
            } else {
              this_.setState({ overlay: div });
            }
          },

          onRemove() {
            const renderedOverlay = this_.state.overlay;
            if (renderedOverlay && !IS_REACT_16) {
              ReactDOM.unmountComponentAtNode(renderedOverlay);
            }
            this_.setState({ overlay: null });
          },

          draw() {
            this_.updateCounter_++;
            this_._onBoundsChanged(map, maps, !this_.props.debounced);

            if (!this_.googleApiLoadedCalled_) {
              this_._onGoogleApiLoaded({ map, maps, ref: this_.googleMapDom_ });
              this_.googleApiLoadedCalled_ = true;
            }

            if (this_.mouse_) {
              const latLng = this_.geoService_.fromContainerPixelToLatLng(
                this_.mouse_
              );
              this_.mouse_.lat = latLng.lat;
              this_.mouse_.lng = latLng.lng;
            }

            this_._onChildMouseMove();

            if (this_.markersDispatcher_) {
              this_.markersDispatcher_.emit('kON_CHANGE');
              if (this_.fireMouseEventOnIdle_) {
                this_.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
              }
            }
          },
        });

        this.overlay_ = overlay;

        overlay.setMap(map);
        if (this.props.heatmap.positions) {
          this.heatmap.setMap(map);
        }

        if (this.props.onTilesLoaded) {
          maps.event.addListener(map, 'tilesloaded', () => {
            this_._onTilesLoaded();
          });
        }

        maps.event.addListener(map, 'zoom_changed', () => {
          // recalc position at zoom start
          if (this_.geoService_.getZoom() !== map.getZoom()) {
            if (!this_.zoomAnimationInProgress_) {
              this_.zoomAnimationInProgress_ = true;
              this_._onZoomAnimationStart(map.zoom);
            }

            // If draw() is not called each frame during a zoom animation,
            // simulate it.
            if (mapsVersion < DRAW_CALLED_DURING_ANIMATION_VERSION) {
              const TIMEOUT_ZOOM = 300;

              if (
                new Date().getTime() - this.zoomControlClickTime_ <
                TIMEOUT_ZOOM
              ) {
                // there is strange Google Map Api behavior in chrome when zoom animation of map
                // is started only on second raf call, if was click on zoom control
                // or +- keys pressed, so i wait for two rafs before change state

                // this does not fully prevent animation jump
                // but reduce it's occurence probability
                raf(() =>
                  raf(() => {
                    this_.updateCounter_++;
                    this_._onBoundsChanged(map, maps);
                  })
                );
              } else {
                this_.updateCounter_++;
                this_._onBoundsChanged(map, maps);
              }
            }
          }
        });

        maps.event.addListener(map, 'idle', () => {
          if (this.resetSizeOnIdle_) {
            this._setViewSize();
            const currMinZoom = this._computeMinZoom(options.minZoom);

            if (currMinZoom !== this.minZoom_) {
              this.minZoom_ = currMinZoom;
              map.setOptions({ minZoom: currMinZoom });
            }

            this.resetSizeOnIdle_ = false;
          }

          if (this_.zoomAnimationInProgress_) {
            this_.zoomAnimationInProgress_ = false;
            this_._onZoomAnimationEnd(map.zoom);
          }

          this_.updateCounter_++;
          this_._onBoundsChanged(map, maps);

          this_.dragTime_ = 0;

          if (this_.markersDispatcher_) {
            this_.markersDispatcher_.emit('kON_CHANGE');
          }
        });

        maps.event.addListener(map, 'mouseover', () => {
          // has advantage over div MouseLeave
          this_.mouseInMap_ = true;
        });

        // an alternative way to know the mouse is back within the map
        // This would not fire when clicking/interacting with google maps
        // own on-map countrols+markers. This handles an edge case for touch devices
        // + 'draggable:false' custom option. See #332 for more details.
        maps.event.addListener(map, 'click', () => {
          this_.mouseInMap_ = true;
        });

        maps.event.addListener(map, 'mouseout', () => {
          // has advantage over div MouseLeave
          this_.mouseInMap_ = false;
          this_.mouse_ = null;
          this_.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
        });

        maps.event.addListener(map, 'drag', () => {
          this_.dragTime_ = new Date().getTime();
          this_._onDrag(map);
        });

        maps.event.addListener(map, 'dragend', () => {
          // 'dragend' fires on mouse release.
          // 'idle' listener waits until drag inertia ends before firing `onDragEnd`
          const idleListener = maps.event.addListener(map, 'idle', () => {
            maps.event.removeListener(idleListener);
            this_._onDragEnd(map);
          });
        });
        // user choosing satellite vs roads, etc
        maps.event.addListener(map, 'maptypeid_changed', () => {
          this_._onMapTypeIdChange(map.getMapTypeId());
        });
      })
      .catch((e) => {
        // notify callback of load failure
        this._onGoogleApiLoaded({
          map: null,
          maps: null,
          ref: this.googleMapDom_,
        });
        console.error(e); // eslint-disable-line no-console
        throw e;
      });
  };

  _onGoogleApiLoaded = (...args) => {
    if (this.props.onGoogleApiLoaded) {
      if (
        process.env.NODE_ENV !== 'production' &&
        this.props.yesIWantToUseGoogleMapApiInternals !== true
      ) {
        console.warn(
          'GoogleMap: ' + // eslint-disable-line
            'Usage of internal api objects is dangerous ' +
            'and can cause a lot of issues.\n' +
            'To hide this warning add yesIWantToUseGoogleMapApiInternals={true} ' +
            'to <GoogleMap instance'
        );
      }

      this.props.onGoogleApiLoaded(...args);
    }
  };

  _getHoverDistance = () => this.props.hoverDistance;

  _onDrag = (...args) => this.props.onDrag && this.props.onDrag(...args);

  _onDragEnd = (...args) =>
    this.props.onDragEnd && this.props.onDragEnd(...args);

  _onMapTypeIdChange = (...args) =>
    this.props.onMapTypeIdChange && this.props.onMapTypeIdChange(...args);

  _onZoomAnimationStart = (...args) =>
    this.props.onZoomAnimationStart && this.props.onZoomAnimationStart(...args);

  _onZoomAnimationEnd = (...args) =>
    this.props.onZoomAnimationEnd && this.props.onZoomAnimationEnd(...args);

  _onTilesLoaded = () => this.props.onTilesLoaded && this.props.onTilesLoaded();

  _onChildClick = (...args) => {
    if (this.props.onChildClick) {
      return this.props.onChildClick(...args);
    }
    return undefined;
  };

  _onChildMouseDown = (hoverKey, childProps) => {
    this.childMouseDownArgs_ = [hoverKey, childProps];
    if (this.props.onChildMouseDown) {
      this.props.onChildMouseDown(hoverKey, childProps, { ...this.mouse_ });
    }
  };

  // this method works only if this.props.onChildMouseDown was called
  _onChildMouseUp = () => {
    if (this.childMouseDownArgs_) {
      if (this.props.onChildMouseUp) {
        this.props.onChildMouseUp(...this.childMouseDownArgs_, {
          ...this.mouse_,
        });
      }
      this.childMouseDownArgs_ = null;
      this.childMouseUpTime_ = new Date().getTime();
    }
  };

  // this method works only if this.props.onChildMouseDown was called
  _onChildMouseMove = () => {
    if (this.childMouseDownArgs_) {
      if (this.props.onChildMouseMove) {
        this.props.onChildMouseMove(...this.childMouseDownArgs_, {
          ...this.mouse_,
        });
      }
    }
  };

  _onChildMouseEnter = (...args) => {
    if (this.props.onChildMouseEnter) {
      return this.props.onChildMouseEnter(...args);
    }
    return undefined;
  };

  _onChildMouseLeave = (...args) => {
    if (this.props.onChildMouseLeave) {
      return this.props.onChildMouseLeave(...args);
    }
    return undefined;
  };

  _setViewSize = () => {
    if (!this.mounted_) return;
    if (isFullScreen()) {
      this.geoService_.setViewSize(window.innerWidth, window.innerHeight);
    } else {
      const mapDom = ReactDOM.findDOMNode(this.googleMapDom_);
      this.geoService_.setViewSize(mapDom.clientWidth, mapDom.clientHeight);
    }
    this._onBoundsChanged();
  };

  _onWindowResize = () => {
    this.resetSizeOnIdle_ = true;
  };

  _onMapMouseMove = (e) => {
    if (!this.mouseInMap_) return;

    const currTime = new Date().getTime();
    const K_RECALC_CLIENT_RECT_MS = 50;

    if (currTime - this.mouseMoveTime_ > K_RECALC_CLIENT_RECT_MS) {
      this.boundingRect_ = e.currentTarget.getBoundingClientRect();
    }
    this.mouseMoveTime_ = currTime;

    const mousePosX = e.clientX - this.boundingRect_.left;
    const mousePosY = e.clientY - this.boundingRect_.top;

    if (!this.mouse_) {
      this.mouse_ = { x: 0, y: 0, lat: 0, lng: 0 };
    }

    this.mouse_.x = mousePosX;
    this.mouse_.y = mousePosY;

    const latLng = this.geoService_.fromContainerPixelToLatLng(this.mouse_);
    this.mouse_.lat = latLng.lat;
    this.mouse_.lng = latLng.lng;

    this._onChildMouseMove();

    if (currTime - this.dragTime_ < K_IDLE_TIMEOUT) {
      this.fireMouseEventOnIdle_ = true;
    } else {
      this.markersDispatcher_.emit('kON_MOUSE_POSITION_CHANGE');
      this.fireMouseEventOnIdle_ = false;
    }
  };

  // K_IDLE_CLICK_TIMEOUT - looks like 300 is enough
  _onClick = (...args) =>
    this.props.onClick &&
    !this.childMouseDownArgs_ &&
    new Date().getTime() - this.childMouseUpTime_ > K_IDLE_CLICK_TIMEOUT &&
    this.dragTime_ === 0 &&
    this.props.onClick(...args);

  _onMapClick = (event) => {
    if (this.markersDispatcher_) {
      // support touch events and recalculate mouse position on click
      this._onMapMouseMove(event);
      const currTime = new Date().getTime();
      if (currTime - this.dragTime_ > K_IDLE_TIMEOUT) {
        if (this.mouse_) {
          this._onClick({
            ...this.mouse_,
            event,
          });
        }

        this.markersDispatcher_.emit('kON_CLICK', event);
      }
    }
  };

  // gmap can't prevent map drag if mousedown event already occured
  // the only workaround I find is prevent mousedown native browser event
  _onMapMouseDownNative = (event) => {
    if (!this.mouseInMap_) return;

    this._onMapMouseDown(event);
  };

  _onMapMouseDown = (event) => {
    if (this.markersDispatcher_) {
      const currTime = new Date().getTime();
      if (currTime - this.dragTime_ > K_IDLE_TIMEOUT) {
        // Hovered marker detected at mouse move could be deleted at mouse down time
        // so it will be good to force hovered marker recalculation
        this._onMapMouseMove(event);
        this.markersDispatcher_.emit('kON_MDOWN', event);
      }
    }
  };

  _onMapMouseDownCapture = () => {
    if (detectBrowser().isChrome) {
      // to fix strange zoom in chrome
      this.zoomControlClickTime_ = new Date().getTime();
    }
  };

  _onKeyDownCapture = () => {
    if (detectBrowser().isChrome) {
      this.zoomControlClickTime_ = new Date().getTime();
    }
  };

  _isCenterDefined = (center) =>
    center &&
    ((isPlainObject(center) && isNumber(center.lat) && isNumber(center.lng)) ||
      (center.length === 2 && isNumber(center[0]) && isNumber(center[1])));

  _onBoundsChanged = (map, maps, callExtBoundsChange) => {
    if (map) {
      const gmC = map.getCenter();
      this.geoService_.setView([gmC.lat(), gmC.lng()], map.getZoom(), 0);
    }

    if (
      (this.props.onChange || this.props.onBoundsChange) &&
      this.geoService_.canProject()
    ) {
      const zoom = this.geoService_.getZoom();
      const bounds = this.geoService_.getBounds();
      const centerLatLng = this.geoService_.getCenter();

      if (!isArraysEqualEps(bounds, this.prevBounds_, kEPS)) {
        if (callExtBoundsChange !== false) {
          const marginBounds = this.geoService_.getBounds(this.props.margin);

          if (this.props.onChange) {
            this.props.onChange({
              center: { ...centerLatLng },
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
                sw: {
                  lat: bounds[4],
                  lng: bounds[5],
                },
                ne: {
                  lat: bounds[6],
                  lng: bounds[7],
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
                sw: {
                  lat: marginBounds[4],
                  lng: marginBounds[5],
                },
                ne: {
                  lat: marginBounds[6],
                  lng: marginBounds[7],
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
    }
  };

  _registerChild = (ref) => {
    this.googleMapDom_ = ref;
  };

  render() {
    const overlay = this.state.overlay;
    const mapMarkerPrerender = !overlay ? (
      <GoogleMapMarkersPrerender
        experimental={this.props.experimental}
        onChildClick={this._onChildClick}
        onChildMouseDown={this._onChildMouseDown}
        onChildMouseEnter={this._onChildMouseEnter}
        onChildMouseLeave={this._onChildMouseLeave}
        geoService={this.geoService_}
        insideMapPanes={false}
        distanceToMouse={this.props.distanceToMouse}
        getHoverDistance={this._getHoverDistance}
        dispatcher={this.markersDispatcher_}
      />
    ) : null;

    return (
      <div
        style={this.props.style}
        onMouseMove={this._onMapMouseMove}
        onMouseDownCapture={this._onMapMouseDownCapture}
        onClick={this._onMapClick}
      >
        <GoogleMapMap registerChild={this._registerChild} />
        {IS_REACT_16 && overlay && createPortal(this._renderPortal(), overlay)}

        {/* render markers before map load done */}
        {mapMarkerPrerender}
      </div>
    );
  }
}

export default GoogleMap;
