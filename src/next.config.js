const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // assetPrefix: isProd ? `https://assets.la-foulee.com` : '',

  webpack: (config, { buildId, dev }) => {
    // console.log(config.module.rules[1].include);
    // console.log(config.module.rules[1].exclude());
    // console.log(config.module.rules[1].options);

    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fr)$/)
    );

    return config;
  }
};
