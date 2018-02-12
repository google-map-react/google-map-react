import fp from 'lodash/fp';

export const generateHeatmap = (instance, { positions }) =>
  new instance.visualization.HeatmapLayer({
    data: fp.reduce(
      (acc, { lat, lng }) => {
        acc.push({
          location: new instance.LatLng(lat, lng),
        });
        return acc;
      },
      [],
      positions
    ),
  });

export const optionsHeatmap = (instance, { options }) =>
  fp.map(
    option => instance.set(option, options[option]),
    Object.keys(options || {})
  );
