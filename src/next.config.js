const ENV_FILE =
  process.env.LA_FOULEE_ENV === "local"
    ? `.env.local`
    : `.env.${process.env.LA_FOULEE_ENV}`;
require("dotenv").config({ path: ENV_FILE });

const webpack = require("webpack");
const { PHASE_PRODUCTION_BUILD } = require("next/constants");

const { ANALYZE } = process.env;
let webpackBundleAnalyzer;

if (ANALYZE) {
  webpackBundleAnalyzer = require("webpack-bundle-analyzer");
}

console.log(
  "Building",
  process.env.NODE_ENV,
  "environnement && variables of",
  process.env.LA_FOULEE_ENV
);

const assetPrefix =
  process.env.NODE_ENV === "production" &&
  process.env.LA_FOULEE_ENV === "production"
    ? process.env.ASSETS_URL
    : "";

module.exports = (phase, { defaultConfig }) => {
  return {
    assetPrefix,

    publicRuntimeConfig: {
      APP_URL: process.env.APP_URL,
      ASSETS_URL: process.env.ASSETS_URL,
      EVENT_API_URL: process.env.EVENT_API_URL,
      NEWSLETTER_API_URL: process.env.NEWSLETTER_API_URL,
      EVENT_CONTRIBUTION_API_URL: process.env.EVENT_CONTRIBUTION_API_URL,
      AWS_API_REGION: process.env.AWS_API_REGION,
      IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
      GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
      GA_TRACKING_ID: process.env.GA_TRACKING_ID,
      GIPHY_KEY: process.env.GIPHY_KEY,
      FB_APP_ID: process.env.FB_APP_ID
    },

    generateBuildId: async () => {
      return require("child_process")
        .execSync("git rev-parse HEAD")
        .toString()
        .trim();
    },

    webpack: (config, { buildId, dev, isServer }) => {
      if (isServer && phase === PHASE_PRODUCTION_BUILD) {
        console.log("[Webpack Server] Building app with this buildId", buildId);
      }

      config.plugins.push(
        new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(fr)$/)
      );

      if (ANALYZE) {
        config.plugins.push(
          new webpackBundleAnalyzer.BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerPort: 8888,
            openAnalyzer: true
          })
        );
      }

      return config;
    }
  };
};
