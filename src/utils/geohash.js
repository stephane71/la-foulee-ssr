let Geohash = {};

/* (Geohash-specific) Base32 map */
Geohash.base32 = '0123456789bcdefghjkmnpqrstuvwxyz';

Geohash.encode = function(lat, lon, precision) {
  // infer precision?
  if (typeof precision == 'undefined') {
    // refine geohash until it matches precision of supplied lat/lon
    for (var p = 1; p <= 12; p++) {
      var hash = Geohash.encode(lat, lon, p);
      var posn = Geohash.decode(hash);
      if (posn.lat == lat && posn.lon == lon) return hash;
    }
    precision = 12; // set to maximum
  }

  lat = Number(lat);
  lon = Number(lon);
  precision = Number(precision);

  if (isNaN(lat) || isNaN(lon) || isNaN(precision))
    throw new Error('Invalid geohash');

  var idx = 0; // index into base32 map
  var bit = 0; // each char holds 5 bits
  var evenBit = true;
  var geohash = '';

  var latMin = -90,
    latMax = 90;
  var lonMin = -180,
    lonMax = 180;

  while (geohash.length < precision) {
    if (evenBit) {
      // bisect E-W longitude
      var lonMid = (lonMin + lonMax) / 2;
      if (lon >= lonMid) {
        idx = idx * 2 + 1;
        lonMin = lonMid;
      } else {
        idx = idx * 2;
        lonMax = lonMid;
      }
    } else {
      // bisect N-S latitude
      var latMid = (latMin + latMax) / 2;
      if (lat >= latMid) {
        idx = idx * 2 + 1;
        latMin = latMid;
      } else {
        idx = idx * 2;
        latMax = latMid;
      }
    }
    evenBit = !evenBit;

    if (++bit == 5) {
      // 5 bits gives us a character: append it and start over
      geohash += Geohash.base32.charAt(idx);
      bit = 0;
      idx = 0;
    }
  }

  return geohash;
};

const GEOHASH_PRECISION = 4;

module.exports = function({ lat, lng }) {
  return Geohash.encode(lat, lng, GEOHASH_PRECISION);
};
