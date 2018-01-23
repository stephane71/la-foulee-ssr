const configDev = require('./config/client/env.developpement.json');
const configProd = require('./config/client/env.production.json');

let config;

switch (process.env.NODE_ENV) {
  case 'production':
    config = configProd;
    break;
  default:
    config = configDev;
}

module.exports = {
  'process.env.ASSETS_URL': config.ASSETS_URL,
  'process.env.IDENTITY_POOL_ID': config.IDENTITY_POOL_ID,
  'process.env.API_URL': config.API_URL
};
