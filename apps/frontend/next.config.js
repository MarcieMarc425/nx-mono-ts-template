//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nrwl/next/plugins/with-nx');
const withPlugins = require('next-compose-plugins');

const {
  NX_BUNDLE_ANALYZE_ENABLED,
  NX_SOURCE_MAP_ENABLED,
  NX_LOCALES,
  NX_WEB_VITALS_METRIC_REPORT_ENABLED,
} = process.env;

// eslint-disable-next-line import/order
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: NX_BUNDLE_ANALYZE_ENABLED === 'true',
});

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  reactStrictMode: true,
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  experimental: {},
  i18n: {
    locales: NX_LOCALES ? NX_LOCALES.split(',') : ['en'],
    defaultLocale: 'en',
  },
  publicRuntimeConfig: {
    nextWebVitalsMetricReport: NX_WEB_VITALS_METRIC_REPORT_ENABLED,
  },
  serverRuntimeConfig: {},
};

module.exports = withPlugins([withNx, withBundleAnalyzer], nextConfig);
