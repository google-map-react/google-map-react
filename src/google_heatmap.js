import map from 'lodash.map';
import reduce from 'lodash.reduce';

export const generateHeatmap = (instance, { positions }) =>
  new instance.visualization.HeatmapLayer({
    data: reduce(
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
  map(
    option => instance.set(option, options[option]),
    Object.keys(options || {})
  );
