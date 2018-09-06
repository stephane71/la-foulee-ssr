const getGeohash = require('../utils/geohash');

module.exports = function(city) {
  const { location } = city.geometry;
  return getGeohash(location);
};
