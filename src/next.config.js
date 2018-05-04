require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const webpack = require('webpack');

const { ANALYZE } = process.env;
let webpackBundleAnalyzer;

if (ANALYZE) {
  webpackBundleAnalyzer = require('webpack-bundle-analyzer');
}

console.log('Building', process.env.NODE_ENV, 'environnement');

module.exports = {
  // useFileSystemPublicRoutes: false,
  // assetPrefix: isProd ? `https://assets.la-foulee.com` : '',

  publicRuntimeConfig: {
    ASSETS_URL: process.env.ASSETS_URL,
    API_URL: process.env.API_URL,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY
  },

  exportPathMap: function() {
    return {
      '/': { page: '/' }
    };
  },

  webpack: (config, { buildId, dev }) => {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fr)$/)
    );

    if (ANALYZE) {
      config.plugins.push(
        new webpackBundleAnalyzer.BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true
        })
      );
    }

    return config;
  }
};
