/* eslint-disable */
import './utils/jsdomInit.js';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import expect from 'expect';

import TestUtils from 'react-dom/test-utils';
import GoogleMap from '../../src/google_map';

describe('Components', () => {
  it('Should work', () => {
    const mapMarkerClassName = 'mapMarkerClassName';

    class MapMarker extends Component {
      render() {
        return <div className={mapMarkerClassName}>Marker</div>;
      }
    }

    class MapHolder extends Component {
      // eslint-disable-line react/no-multi-comp
      static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any,
      };

      static defaultProps = {
        center: [59.938043, 30.337157],
        zoom: 9,
      };

      render() {
        return (
          <GoogleMap center={this.props.center} zoom={this.props.zoom}>
            <MapMarker lat={59.955413} lng={30.337844} />
          </GoogleMap>
        );
      }
    }

    // console.log('GoogleMap', GoogleMap);

    const mapHolder = TestUtils.renderIntoDocument(<MapHolder />);

    const marker = TestUtils.findRenderedDOMComponentWithClass(
      mapHolder,
      'mapMarkerClassName'
    );
    expect(marker.parentNode.style.left).toEqual('0.250129066669615px');
    expect(marker.parentNode.style.top).toEqual('-12.62811732746195px');
  });

  it('Should accept center prop as lat lng object', () => {
    const mapMarkerClassName = 'mapMarkerClassName';

    class MapMarker extends Component {
      // eslint-disable-line react/no-multi-comp
      render() {
        return <div className={mapMarkerClassName}>Marker</div>;
      }
    }

    class MapHolder extends Component {
      // eslint-disable-line react/no-multi-comp
      static propTypes = {
        center: PropTypes.any,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any,
      };

      static defaultProps = {
        center: { lat: 59.938043, lng: 30.337157 },
        zoom: 9,
      };

      constructor(props) {
        super(props);
      }

      render() {
        return (
          <GoogleMap center={this.props.center} zoom={this.props.zoom}>
            <MapMarker lat={59.955413} lng={30.337844} />
          </GoogleMap>
        );
      }
    }

    const mapHolder = TestUtils.renderIntoDocument(<MapHolder />);

    const marker = TestUtils.findRenderedDOMComponentWithClass(
      mapHolder,
      'mapMarkerClassName'
    );
    expect(marker.parentNode.style.left).toEqual('0.250129066669615px');
    expect(marker.parentNode.style.top).toEqual('-12.62811732746195px');
  });

  it('Should accept defaultCenter and defaultZoom props', () => {
    const mapMarkerClassName = 'mapMarkerClassName';

    class MapMarker extends Component {
      // eslint-disable-line react/no-multi-comp
      render() {
        return <div className={mapMarkerClassName}>Marker</div>;
      }
    }

    class MapHolder extends Component {
      // eslint-disable-line react/no-multi-comp
      static propTypes = {
        center: PropTypes.any,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any,
      };

      static defaultProps = {
        center: { lat: 59.938043, lng: 30.337157 },
        zoom: 9,
      };

      constructor(props) {
        super(props);
      }

      render() {
        return (
          <GoogleMap
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
          >
            <MapMarker lat={59.955413} lng={30.337844} />
          </GoogleMap>
        );
      }
    }

    const mapHolder = TestUtils.renderIntoDocument(<MapHolder />);

    const marker = TestUtils.findRenderedDOMComponentWithClass(
      mapHolder,
      'mapMarkerClassName'
    );
    expect(marker.parentNode.style.left).toEqual('0.250129066669615px');
    expect(marker.parentNode.style.top).toEqual('-12.62811732746195px');
  });

  it('Should call custom loader', () => {
    const API_KEY = 'API_KEY';
    const spy = expect.createSpy(() => {});
    const asyncSpy = async a => spy(a);

    TestUtils.renderIntoDocument(
      <GoogleMap
        // TODO add gmap api mock
        // defaultCenter={{lat: 59.938043, lng: 30.337157}}
        // defaultZoom={9}
        bootstrapURLKeys={{
          key: API_KEY,
        }}
        googleMapLoader={asyncSpy}
      />
    );

    expect(spy.calls.length).toEqual(1);
    expect(spy.calls[0].arguments[0]).toEqual({
      key: API_KEY,
    });
  });

  it('Should add a className to the marker from $markerHolderClassName', () => {
    const markerHolderClassName = 'marker-holder-class-name';

    class MapHolder extends Component {
      // eslint-disable-line react/no-multi-comp
      static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any,
      };

      static defaultProps = {
        center: [59.938043, 30.337157],
        zoom: 9,
      };

      constructor(props) {
        super(props);
      }

      render() {
        return (
          <GoogleMap center={this.props.center} zoom={this.props.zoom}>
            <div
              lat={59.955413}
              lng={30.337844}
              $markerHolderClassName={markerHolderClassName}
            />
          </GoogleMap>
        );
      }
    }

    const mapHolder = TestUtils.renderIntoDocument(<MapHolder />);

    const marker = TestUtils.findRenderedDOMComponentWithClass(
      mapHolder,
      'marker-holder-class-name'
    );
    expect(marker.className).toEqual('marker-holder-class-name');
    expect(marker.style.left).toEqual('0.250129066669615px');
    expect(marker.style.top).toEqual('-12.62811732746195px');
  });

  it('Should not add a className to the marker if $markerHolderClassName is not present', () => {
    class MapHolder extends Component {
      // eslint-disable-line react/no-multi-comp
      static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any,
      };

      static defaultProps = {
        center: [59.938043, 30.337157],
        zoom: 9,
      };

      constructor(props) {
        super(props);
      }

      render() {
        return (
          <GoogleMap center={this.props.center} zoom={this.props.zoom}>
            <div
              className="marker-class-name"
              lat={59.955413}
              lng={30.337844}
            />
          </GoogleMap>
        );
      }
    }

    const mapHolder = TestUtils.renderIntoDocument(<MapHolder />);

    const marker = TestUtils.findRenderedDOMComponentWithClass(
      mapHolder,
      'marker-class-name'
    );
    expect(marker.parentNode.className).toNotExist();
    expect(marker.parentNode.style.left).toEqual('0.250129066669615px');
    expect(marker.parentNode.style.top).toEqual('-12.62811732746195px');
  });
});
