import type { AppProps, NextWebVitalsMetric } from 'next/app';
import Head from 'next/head';
import { getPublicRuntimeConfigs } from '../utils';
import './styles.css';

/**
 * Prints out web vitals to console if feature flag is enabled in .env.
 * Metrics include: hydration, FCP, FID, LCP, CLS, TTFB.
 *
 * For more information, see {@link https://nextjs.org/docs/advanced-features/measuring-performance Measuring performance in Next}
 * @param {NextWebVitalsMetric} metric - next web vitals metric object
 */
export function reportWebVitals(metric: NextWebVitalsMetric): void {
  if (getPublicRuntimeConfigs('nextWebVitalsMetricReport') === 'true') {
    console.log(metric);
  }
}

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to frontend!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
