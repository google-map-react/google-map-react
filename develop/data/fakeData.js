export const susolvkaCoords = { lat: 60.814305, lng: 47.051773 };

export const londonCoords = { lat: 51.508411, lng: -0.125364 };

export const generateMarkers = count =>
  [...Array(count)].fill(0).map((__, index) => ({
    // fill(0) for loose mode
    id: index,
    lat: susolvkaCoords.lat +
      0.01 *
        index *
        Math.sin(30 * Math.PI * index / 180) *
        Math.cos(50 * Math.PI * index / 180) +
      Math.sin(5 * index / 180),
    lng: susolvkaCoords.lng +
      0.01 *
        index *
        Math.cos(70 + 23 * Math.PI * index / 180) *
        Math.cos(50 * Math.PI * index / 180) +
      Math.sin(5 * index / 180),
  }));

export const heatmapData = {
  positions: [
    {
      lat: 60.714305,
      lng: 47.051773,
    },
    {
      lat: 60.734305,
      lng: 47.061773,
    },
    {
      lat: 60.754305,
      lng: 47.081773,
    },
    {
      lat: 60.774305,
      lng: 47.101773,
    },
    {
      lat: 60.804305,
      lng: 47.111773,
    },
  ],
  options: {
    radius: 20,
    opacity: 0.7,
  },
};

function getRandomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export const generateHeatmapData = (lat, lng) => {
  const newFakeReadings = x => {
    const newReadings = [];

    for (let i = 0; i <= x; i++) {
      newReadings.push({
        weight: getRandomNumberBetween(0.1, 4),
        lat: getRandomNumberBetween(lat - 1, lat + 1),
        lng: getRandomNumberBetween(lng - 1, lng + 1),
      });
    }
    return newReadings;
  };
  return {
    positions: newFakeReadings(10),
    options: heatmapData.options,
  };
};
