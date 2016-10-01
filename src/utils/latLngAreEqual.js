// Determines if two LatLngLiteral objects are equal, not just by reference
// but by their properties
export default function latLngAreEqual(latLng1, latLng2) {
  if (latLng1 === latLng2) {
    // Reference equality
    return true;
  }
  if (typeof latLng1 !== 'object' || typeof latLng2 !== 'object') {
    // Check for nulls/invalid types
    return false;
  }
  const { lat1, lng1 } = latLng1;
  const { lat2, lng2 } = latLng2;
  return lat1 === lat2 &&lng1 === lng2;
};