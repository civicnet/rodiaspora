const toRadians = n => n * Math.PI / 180;

const harversine = (target, pos) => {
  const R = 6371e3; // meters
  const targetLatRadians = toRadians(target.latitude);
  const posLatRadians = toRadians(pos.latitude);
  const deltaLat = toRadians(pos.latitude - target.latitude);
  const deltaLon = toRadians(pos.longitude - target.longitude);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
    + Math.cos(targetLatRadians) * Math.cos(posLatRadians)
    * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

module.exports = {
  toRadians,
  harversine,
};
