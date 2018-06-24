require('dotenv').config({ path: `.env.${process.env.LA_FOULEE_ENV}` });
const webpack = require('webpack');
const { PHASE_PRODUCTION_BUILD } = require('next/constants');

const { ANALYZE } = process.env;
let webpackBundleAnalyzer;

if (ANALYZE) {
  webpackBundleAnalyzer = require('webpack-bundle-analyzer');
}

console.log(
  'Building',
  process.env.NODE_ENV,
  'environnement && variables of',
  process.env.LA_FOULEE_ENV
);

module.exports = (phase, { defaultConfig }) => {
  // useFileSystemPublicRoutes: false,
  // assetPrefix: isProd ? `https://quelquechose.la-foulee.com` : '',

  return {
    publicRuntimeConfig: {
      ASSETS_URL: process.env.ASSETS_URL,
      API_URL: process.env.API_URL,
      IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
      GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
      GA_TRACKING_ID: process.env.GA_TRACKING_ID,
      GIPHY_KEY: process.env.GIPHY_KEY
    },

    generateBuildId: async () => {
      return require('child_process')
        .execSync('git rev-parse HEAD')
        .toString()
        .trim();
    },

    webpack: (config, { buildId, dev, isServer }) => {
      if (isServer && phase === PHASE_PRODUCTION_BUILD) {
        console.log('[Webpack Server] Building app with this buildId', buildId);
      }

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
};
