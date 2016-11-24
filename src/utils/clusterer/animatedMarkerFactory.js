import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import LatLngUtils from './LatLngUtils.js';

export const animatedMarkerFactory = (Marker) => {

    class AnimatedMarker extends Component{

    	componentDidMount() {
            const el = ReactDOM.findDOMNode(this);
            var {lat, lng} = this.props;
            var key = JSON.stringify({lat:lat, lng:lng});
            if(this.props.previousLatLngToClusterMap){
                 var oldCluster = this.props.previousLatLngToClusterMap[key];

            }
            if(this.props.map && oldCluster){
                  var oldClusterLatng = {
                    lat: oldCluster.y,
                    lng: oldCluster.x
                };
                var {x, y} = LatLngUtils.latLngToPixel(this.props, this.props.map.getZoom());
                var oldXY = LatLngUtils.latLngToPixel(oldClusterLatng, this.props.map.getZoom());
                var deltaX = x-oldXY.x;
                var deltaY = y-oldXY.y;
                el.style.transform = 'translate3d('+ -deltaX+ 'px, ' + -deltaY + 'px, 0px)';

            }
        }

        componentDidAppear(){
            const el = ReactDOM.findDOMNode(this);
    		this.animateMove = window.setTimeout(()=>{
                if(el)
                    el.style.transform = '';
    		}, 0);
        }

        componentWillUmount(){
    		clearTimeout(this.animateMove);
        }

    	render(){
    		return <Marker {...this.props}></Marker>
    	}

	}
    return AnimatedMarker;
}