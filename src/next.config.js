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

const LOCAL_APP_URL = 'http://localhost:3000';
const DEV_APP_URL = 'https://dev.la-foulee.com';
const APP_URL = 'https://www.la-foulee.com';

module.exports = (phase, { defaultConfig }) => {
  // useFileSystemPublicRoutes: false,
  // assetPrefix: isProd ? `https://quelquechose.la-foulee.com` : '',

  return {
    publicRuntimeConfig: {
      APP_URL:
        process.env.TYPE_ENV === 'local'
          ? LOCAL_APP_URL
          : process.env.LA_FOULEE_ENV === 'dev' ? DEV_APP_URL : APP_URL,
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
