import fp from 'lodash/fp';

export default (instance, data = []) => {
  return new instance.visualization.HeatmapLayer({
    data: fp.reduce(
      (acc, { lat, lng }) => {
        acc.push({
          location: new instance.LatLng(lat, lng),
        });
        return acc;
      },
      [],
      data
    ),
  });
};
