import React, { Component, PropTypes } from 'react';
import Cluster from 'points-cluster';

import TransitionGroupMarker from './TransitionGroupMarker.js';
import { animatedMarkerFactory } from './animatedMarkerFactory.js';

export const MapWithClusteringfactory = (
  Map,
  ClusteredMarker,
  SpiderMarker
) => {
  const AnimatedClusteredMarker = animatedMarkerFactory(ClusteredMarker);
  const AnimatedSpiderMarker = animatedMarkerFactory(SpiderMarker);

  class MapWithClustering extends Component {
    SPIDERYFY_ZOOM_LEVEL = 15;

    constructor(props) {
      super(props);
      this.getClusteredMarkers = this.getClusteredMarkers;
      this.getLatLngs = this.getLatLngs;
      this.getClusterer = this.getClusterer;
      this.getSpiderMarkers = this.getSpiderMarkers.bind(this);
      this.getBBoxforMap = this.getBBoxforMap.bind(this);
      this.state = {
        latLngToClusterMap: this.getLatLngToClusterMap(props),
        previousLatLngToClusterMap: null,
      };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        latLngToClusterMap: this.getLatLngToClusterMap(nextProps),
        latLngToPoints: this.getLatLngToPoints(nextProps),
        previousLatLngToClusterMap: this.state.latLngToClusterMap,
      });
    }

    isPointPartOfAnySpider(latLng) {
      if (!this.state.map) {
        return false;
      }
      if (this.state.map.getZoom() < this.SPIDERYFY_ZOOM_LEVEL) return false;
      var latLngList = this.state.latLngToPoints
        ? this.state.latLngToPoints[JSON.stringify(latLng)]
        : null;
      if (!latLngList) {
        // If Null -> Hasn't been added to cluster.
        return true;
      }
      return latLngList.length > 1;
    }

    getClusteredMarkers(clusters) {
      if (!clusters) return null;
      return clusters.map((cluster, index) => {
        if (cluster.numPoints == 1) {
          var childProps = cluster.points[0].child.props;
          return (
            <TransitionGroupMarker key={childProps.id} {...childProps}>
              {React.cloneElement(cluster.points[0].child, {
                latLngToClusterMap: this.state.latLngToClusterMap,
                previousLatLngToClusterMap: this.state.previousLatLngToClusterMap,
                map: this.state.map,
              })}
            </TransitionGroupMarker>
          );
        } else {
          // #Cluster Icon
          return (
            <TransitionGroupMarker
              key={'cluster' + index}
              lat={cluster.y}
              lng={cluster.x}
            >
              <AnimatedClusteredMarker
                key={'cluster' + index}
                lat={cluster.y}
                lng={cluster.x}
                markerIcon={cluster.numPoints}
                map={this.state.map}
                cluster={cluster}
                isCluster={true}
                latLngToClusterMap={this.state.latLngToClusterMap}
                previousLatLngToClusterMap={
                  this.state.previousLatLngToClusterMap
                }
              />
            </TransitionGroupMarker>
          );
        }
      });
    }

    getSpiderMarkers() {
      var bboxMap = this.getBBoxforMap();
      return Object.keys(this.state.latLngToPoints).map((latLng, index) => {
        var pointsList = this.state.latLngToPoints[latLng];
        if (pointsList.length == 1) {
          return (
            <TransitionGroupMarker
              key={pointsList[0].child.props.id}
              map={this.state.map}
              {...pointsList[0].child.props}
            >
              {pointsList[0].child}
            </TransitionGroupMarker>
          );
        } else {
          var latLngsObject = JSON.parse(latLng);
          return (
            <TransitionGroupMarker
              key={'spider' + pointsList[0].child.props.id}
              lat={latLngsObject.lat}
              lng={latLngsObject.lng}
            >
              <AnimatedSpiderMarker
                key={'spider' + pointsList[0].child.props.id}
                lat={latLngsObject.lat}
                lng={latLngsObject.lng}
                markerIcon={pointsList.length}
                map={this.state.map}
                bboxMap={bboxMap}
                cluster={pointsList}
              />
            </TransitionGroupMarker>
          );
        }
      });
    }

    getBBoxforMap() {
      var element = this.state.map.getDiv();
      return element.getBoundingClientRect();
    }

    getLatLngToClusterMap(props) {
      var clusters = this.getClusters(props);
      if (!clusters) return null;
      var latLngToClusterMap = {};
      clusters.map((cluster, index) => {
        cluster.points.map(point => {
          var latLng = {
            lat: point.lat,
            lng: point.lng,
          };
          latLngToClusterMap[JSON.stringify(latLng)] = cluster;
        });
      });
      return latLngToClusterMap;
    }

    getLatLngToPoints(props) {
      var clusters = this.getClusters(props);
      if (!clusters) return null;
      var latLngToPoints = {};
      clusters.map((cluster, index) => {
        cluster.points.map(point => {
          var latLng = {
            lat: point.lat,
            lng: point.lng,
          };
          if (latLngToPoints[JSON.stringify(latLng)]) {
            latLngToPoints[JSON.stringify(latLng)].push(point);
          } else {
            latLngToPoints[JSON.stringify(latLng)] = [point];
          }
        });
      });
      return latLngToPoints;
    }

    getLatLngs(children) {
      if (!children) return null;
      return children.map(child => {
        return {
          lat: child.props.lat,
          lng: child.props.lng,
          child: child,
        };
      });
    }

    getClusterer(latLngs) {
      if (!latLngs) return null;
      return Cluster(latLngs);
    }

    getBounds(map) {
      if (!map)
        return {
          bounds: { nw: { lat: 85, lng: -180 }, se: { lat: -85, lng: 180 } },
          zoom: 2,
        };
      var boundsJson = map.getBounds().toJSON();
      return {
        bounds: {
          nw: {
            lat: boundsJson.north,
            lng: boundsJson.west,
          },
          se: {
            lat: boundsJson.south,
            lng: boundsJson.east,
          },
        },
        zoom: map.getZoom(),
      };
    }

    getClusters = props => {
      if (!this.state || !this.state.map) return null;
      var bounds = this.getBounds(this.state.map);
      var filteredMarkers = this.getMarkersIncludedInCluster(props);
      var clusterer = this.getClusterer(this.getLatLngs(filteredMarkers));
      if (!clusterer || !this.state.map)
        return null;
      else {
        return clusterer(bounds);
      }
    };

    getFlattenChildren(props) {
      return props.children;
    }

    getMarkersNotInCluster(props) {
      if (!this.getFlattenChildren(props)) {
        return [];
      }
      var notIncluster = this.getFlattenChildren(props).filter(child => {
        if (!child) return true;
        return child.props.shouldFilterFromCluster;
      });
      return notIncluster;
    }

    getMarkersIncludedInCluster(props) {
      if (!this.getFlattenChildren(props)) {
        return [];
      }
      return this.getFlattenChildren(props).filter(child => {
        if (!child) return false;
        return !child.props.shouldFilterFromCluster;
      });
    }

    _distanceToMouse = (markerPos, mousePos, markerProps) => {
      var x = markerPos.x;
      // because of marker non symmetric,
      // we transform it central point to measure distance from marker circle center
      // you can change distance function to any other distance measure
      var y = markerPos.y;

      // and i want that hover probability on markers with text ==== 'A' be greater than others
      // so i tweak distance function (for example it's more likely to me that user click on 'A' marker)
      // another way is to decrease distance for 'A' marker
      // this is really visible on small zoom values or if there are a lot of markers on the map
      var distanceKoef = 1;
      if (markerProps.isSelected || markerProps.shouldFilterFromCluster) {
        distanceKoef = 0.9;
      }
      // it's just a simple example, you can tweak distance function as you wish
      return distanceKoef *
        Math.sqrt(
          (x - mousePos.x) * (x - mousePos.x) +
            (y - mousePos.y) * (y - mousePos.y)
        );
    };

    onGoogleApiLoaded = ({ map, maps }) => {
      console.log(map, 'HA');
      this.setState({ map: map });
      if (this.props.onGoogleApiLoaded) {
        this.props.onGoogleApiLoaded({ map, maps });
      }
    };

    render() {
      var { enableClustering, ...other } = this.props;
      var { map } = this.state;
      var clusteredMarkers = [];
      if (map) {
        var zoomLevel = map.getZoom();
        var clusters = this.getClusters(this.props);
        if (zoomLevel >= this.SPIDERYFY_ZOOM_LEVEL) {
          clusteredMarkers = this.getSpiderMarkers();
        } else {
          clusteredMarkers = clusters ? this.getClusteredMarkers(clusters) : [];
        }
      }
      return (
        <Map
          {...other}
          distanceToMouse={this._distanceToMouse}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={this.onGoogleApiLoaded}
        >
          {clusteredMarkers}

          {this.getMarkersNotInCluster(this.props)}

        </Map>
      );
    }
  }

  return MapWithClustering;
};
