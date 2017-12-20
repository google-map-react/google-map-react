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
