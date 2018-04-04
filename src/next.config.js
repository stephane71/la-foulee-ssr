const webpack = require('webpack');

const { ANALYZE } = process.env;
let webpackBundleAnalyzer;

if (ANALYZE) {
  webpackBundleAnalyzer = require('webpack-bundle-analyzer');
}

module.exports = {
  // useFileSystemPublicRoutes: false,
  // assetPrefix: isProd ? `https://assets.la-foulee.com` : '',

  publicRuntimeConfig: {
    ASSETS_URL: 'https://assets.la-foulee.com',
    API_URL: 'https://api.la-foulee.com/test'
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
