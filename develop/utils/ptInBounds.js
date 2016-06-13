const ptInSect = (x, a, b) => (x - a) * (x - b) <= 0;

export default ({ nw, se }, pt) => {
  const lngs = nw.lng < se.lng
     ? [[nw.lng, se.lng]]
     : [[nw.lng, 180], [-180, se.lng]];


  return (
    ptInSect(pt.lat, se.lat, nw.lat) &&
    lngs.some(([lngFrom, lngTo]) => ptInSect(pt.lng, lngFrom, lngTo))
  );
};
