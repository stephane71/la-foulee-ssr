const slug = require('slug');

const getGMapsPredicitons = require('./getGMapsPredicitons');
const getGMapsCityDetails = require('./getGMapsCityDetails');

const MAX_WIDTH_CITY_PHOTO = 800;
const MAX_HEIGHT_CITY_PHOTO = 400;

const NO_CITY_FOUND = null;

module.exports = async function(city) {
  let predictions = await getGMapsPredicitons(city);
  if (!predictions.length) {
    console.log(`[La Foulée] getCity: no predicitions for ${city}`);
    return NO_CITY_FOUND;
  }

  predictions = predictions.filter(
    ({ terms }) => slug(terms[0].value, { lower: true }) === city
  );
  if (!predictions.length) {
    console.log(`[La Foulée] getCity: no predicitons match city arg: ${city}`);
    return NO_CITY_FOUND;
  }

  city = await getGMapsCityDetails(predictions[0], {
    maxWidth: MAX_WIDTH_CITY_PHOTO,
    maxHeight: MAX_HEIGHT_CITY_PHOTO
  });
  if (!city) {
    console.log(
      `[La Foulée] getCity: no city details found for ${
        predictions[0].place_id
      }`
    );
    return NO_CITY_FOUND;
  }

  return city;
};
