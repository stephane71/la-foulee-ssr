const webpack = require('webpack');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { ANALYZE } = process.env;

console.log('- next.config.js -');
console.log('NODE_ENV:', process.env.NODE_ENV);

module.exports = {
  // assetPrefix: isProd ? `https://assets.la-foulee.com` : '',

  webpack: (config, { buildId, dev }) => {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fr)$/)
    );

    if (ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true
        })
      );
    }

    return config;
  }
};
