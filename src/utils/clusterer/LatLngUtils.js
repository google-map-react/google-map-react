class LatLngUtils {

    static world2LatLng({ x, y }) {
      const n = Math.PI - 2 * Math.PI * y;

      // TODO test that this is faster
      // 360 * Math.atan(Math.exp((180 - y * 360) * Math.PI / 180)) / Math.PI - 90;
      return {
        lat: (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
        lng: x * 360 - 180,
      };
    }

    static latLng2World(latLng) {
        var {lat, lng} = latLng;
      const sin = Math.sin(lat * Math.PI / 180);
      const x = (lng / 360 + 0.5);
      let y = (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);

      y = y < -1 // eslint-disable-line
        ? -1
        : y > 1
          ? 1
          : y;
      return {x, y};
    }

    static world2Screen(obj, zoom){
        var {x, y} = obj;
       const scale = Math.pow(2, zoom);
       return {
          x: x * scale * 256, // 256 = 256,
          y: y * scale * 256 
       }
    }

    static screen2World(obj, zoom){
        var {x, y} = obj;
        const scale = Math.pow(2, zoom);
        return {
          x: x /( scale * 256), // 256 = 256,
          y: y /( scale * 256 )
       }
    }

    static latLngToPixel(latLng, zoom){
        return LatLngUtils.world2Screen(LatLngUtils.latLng2World(latLng), zoom);
    }

    static pixelToLatLng(pixel, zoom){
        return LatLngUtils.world2LatLng(LatLngUtils.screen2World(pixel, zoom));
    }

    static getLatLngToPixel(bboxMap, map,  latLng){
        var bbox = bboxMap;
        var boundsJson = map.getBounds().toJSON();
        var nw = {
                    lat: boundsJson.north,
                    lng: boundsJson.west
                }

        nw = LatLngUtils.latLngToPixel(nw, map.getZoom());
        var obj  = LatLngUtils.latLngToPixel(latLng, map.getZoom());
         obj = {
            x: obj.x - nw.x + bbox.left,
            y: obj.y - nw.y + bbox.top
        }
        return obj;
    }

    static getPixelToLatLng(bboxMap, map, screenPixel){
        var bbox = bboxMap;
        var boundsJson = map.getBounds().toJSON();
        var nw = {
                    lat: boundsJson.north,
                    lng: boundsJson.west
                    };

        nw = LatLngUtils.latLngToPixel(nw, map.getZoom());

        var mapPixel = {
            x: nw.x + screenPixel.x - bbox.left,
            y: nw.y + screenPixel.y - bbox.top
        }
        return LatLngUtils.pixelToLatLng(mapPixel, map.getZoom());
    }

}

export default LatLngUtils;