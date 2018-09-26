const getGeohash = require('../utils/geohash');

module.exports = function(city) {
  return getGeohash(city.location);
};
