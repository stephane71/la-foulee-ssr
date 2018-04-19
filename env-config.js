const configDev = require('./config/env.developpement.json');
const configProd = require('./config/env.production.json');

let config;

switch (process.env.NODE_ENV) {
  case 'production':
    config = configProd;
    break;
  default:
    config = configDev;
}

module.exports = {
  'process.env.IDENTITY_POOL_ID': config.IDENTITY_POOL_ID,
  'process.env.GOOGLE_PLACES_API_KEY': config.GOOGLE_PLACES_API_KEY,
  'process.env.GOOGLE_GEOLOC_API_KEY': config.GOOGLE_GEOLOC_API_KEY
};
