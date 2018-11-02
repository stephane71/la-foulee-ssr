const slug = require("slug");
const uuidv4 = require("uuid/v4");

const getGMapsPredicitons = require("./getGMapsPredicitons");
const getGMapsCityDetails = require("./getGMapsCityDetails");

const MAX_WIDTH_CITY_PHOTO = 800;
const MAX_HEIGHT_CITY_PHOTO = 400;

const NO_PLACE_FOUND = null;

module.exports = async function(type, value) {
  const sessionToken = uuidv4();

  let predictions = await getGMapsPredicitons(type, value, sessionToken);
  if (!predictions.length) {
    console.log(
      `[La Foulee] getPlace: no predicitions for type: ${type} - value: ${value}`
    );
    return NO_PLACE_FOUND;
  }

  const slugValue = slug(value, { lower: true });

  predictions = predictions.filter(
    ({ terms }) => slug(terms[0].value, { lower: true }) === slugValue
  );
  if (!predictions.length) {
    console.log(
      `[La Foulee] getPlace: no predicitons match place arg: ${value}`
    );
    return NO_PLACE_FOUND;
  }

  const place = await getGMapsCityDetails(
    predictions[0],
    {
      maxWidth: MAX_WIDTH_CITY_PHOTO,
      maxHeight: MAX_HEIGHT_CITY_PHOTO
    },
    sessionToken
  );
  if (!place) {
    console.log(
      `[La Foulee] getPlace: no city details found for ${
        predictions[0].place_id
      }`
    );
    return NO_PLACE_FOUND;
  }

  return place;
};
