const webpack = require('webpack');

console.log('- next.config.js -');
console.log('NODE_ENV:', process.env.NODE_ENV);

module.exports = {
  // assetPrefix: isProd ? `https://assets.la-foulee.com` : '',

  webpack: (config, { buildId, dev }) => {
    config.plugins.concat([
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fr)$/)
    ]);

    return config;
  }
};
