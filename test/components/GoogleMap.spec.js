import './utils/jsdomInit.js';

const React = require('react');
const { PropTypes, Component } = React;
const expect = require('expect');

const TestUtils = require('react-addons-test-utils');
const GoogleMap = require('../../src/index');

describe('Components', () => {
  it('Should work', () => {
    const mapMarkerClassName = 'mapMarkerClassName';

    class MapMarker extends Component {
      render() {
        return (
          <div className={mapMarkerClassName}>Marker</div>
        );
      }
    }

    class MapHolder extends Component { // eslint-disable-line react/no-multi-comp
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
           <GoogleMap
            center={this.props.center}
            zoom={this.props.zoom}
          >
            <MapMarker lat={59.955413} lng={30.337844} />
          </GoogleMap>
        );
      }
    }

    const mapHolder = TestUtils.renderIntoDocument(
      <MapHolder />
    );

    const marker = TestUtils.findRenderedDOMComponentWithClass(mapHolder, 'mapMarkerClassName');
    expect(marker.parentNode.style.left).toEqual('0.250129066669615px');
    expect(marker.parentNode.style.top).toEqual('-12.62811732746195px');
  });

  it('Should accept center prop as lat lng object', () => {
    const mapMarkerClassName = 'mapMarkerClassName';

    class MapMarker extends Component { // eslint-disable-line react/no-multi-comp
      render() {
        return (
          <div className={mapMarkerClassName}>Marker</div>
        );
      }
    }

    class MapHolder extends Component { // eslint-disable-line react/no-multi-comp
      static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any,
      };

      static defaultProps = {
        center: {lat: 59.938043, lng: 30.337157},
        zoom: 9,
      };

      constructor(props) {
        super(props);
      }

      render() {
        return (
           <GoogleMap
            center={this.props.center}
            zoom={this.props.zoom}
          >
            <MapMarker lat={59.955413} lng={30.337844} />
          </GoogleMap>
        );
      }
    }

    const mapHolder = TestUtils.renderIntoDocument(
      <MapHolder />
    );

    const marker = TestUtils.findRenderedDOMComponentWithClass(mapHolder, 'mapMarkerClassName');
    expect(marker.parentNode.style.left).toEqual('0.250129066669615px');
    expect(marker.parentNode.style.top).toEqual('-12.62811732746195px');
  });

  it('Should accept defaultCenter and defaultZoom props', () => {
    const mapMarkerClassName = 'mapMarkerClassName';

    class MapMarker extends Component { // eslint-disable-line react/no-multi-comp
      render() {
        return (
          <div className={mapMarkerClassName}>Marker</div>
        );
      }
    }

    class MapHolder extends Component { // eslint-disable-line react/no-multi-comp
      static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any,
      };

      static defaultProps = {
        center: {lat: 59.938043, lng: 30.337157},
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

    const mapHolder = TestUtils.renderIntoDocument(
      <MapHolder />
    );

    const marker = TestUtils.findRenderedDOMComponentWithClass(mapHolder, 'mapMarkerClassName');
    expect(marker.parentNode.style.left).toEqual('0.250129066669615px');
    expect(marker.parentNode.style.top).toEqual('-12.62811732746195px');
  });


  it('Should call custom loader', () => {
    const API_KEY = 'API_KEY';
    const spy = expect.createSpy(() => {});
    const asyncSpy = async (a) => spy(a);

    TestUtils.renderIntoDocument(
      <GoogleMap
        apiKey={API_KEY}
        googleMapLoader={asyncSpy}
      />
    );

    expect(spy.calls.length).toEqual(1);
    expect(spy.calls[0].arguments[0]).toEqual(API_KEY);
  });
});
