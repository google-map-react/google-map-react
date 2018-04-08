export const generateHeatmap = (instance, { positions }) =>
  new instance.visualization.HeatmapLayer({
    data: positions.reduce(
      (acc, { lat, lng }) => {
        acc.push({
          location: new instance.LatLng(lat, lng),
        });
        return acc;
      },
      []
    ),
  });

export const optionsHeatmap = (instance, { options = {} }) =>
  Object.keys(options).map(option => instance.set(option, options[option]));
