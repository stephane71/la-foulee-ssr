const webpack = require('webpack');

const { ANALYZE } = process.env;
let webpackBundleAnalyzer;

if (ANALYZE) {
  webpackBundleAnalyzer = require('webpack-bundle-analyzer');
}

console.log('- next.config.js -');
console.log('NODE_ENV:', process.env.NODE_ENV);

module.exports = {
  // useFileSystemPublicRoutes: false,
  // assetPrefix: isProd ? `https://assets.la-foulee.com` : '',

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
