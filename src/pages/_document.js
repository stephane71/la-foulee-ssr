import Document, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';
import flush from 'styled-jsx/server';

import { dominant } from '../colors';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const { ASSETS_URL, GA_TRACKING_ID, FB_APP_ID } = publicRuntimeConfig;

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html lang={'fr-fr'}>
        <Head>
          {/* OPEN GRAPH */}
          <meta property={'og:site_name'} content={'La Foulée'} />
          <meta property={'og:type'} content={'website'} />
          <meta property={'og:locale'} content={'fr_FR'} />

          {/* FB */}
          {process.env.NODE_ENV === 'production' && (
            <meta property={'fb:app_id'} content={FB_APP_ID} />
          )}

          {process.env.NODE_ENV !== 'production' && (
            <meta name={'robots'} content={'noindex, nofollow'} />
          )}

          {/* Global METAs */}
          <meta
            name={'viewport'}
            content={
              'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
            }
          />
          <meta name={'mobile-web-app-capable'} content={'yes'} />
          <meta
            name={'apple-mobile-web-app-status-bar-style'}
            content={dominant}
          />
          <meta name={'apple-mobile-web-app-title'} content={'La Foulée'} />
          <meta name={'application-name'} content={'La Foulée'} />
          <meta name={'theme-color'} content={dominant} />

          {/* ICONS */}
          <link
            rel={'shortcut icon'}
            type={'image/x-icon'}
            href={`${ASSETS_URL}/favicon.ico`}
          />
          <link
            rel={'icon'}
            type={'image/png'}
            sizes={'16x16'}
            href={`${ASSETS_URL}/favicon-16x16.png`}
          />
          <link
            rel={'icon'}
            type={'image/png'}
            sizes={'32x32'}
            href={`${ASSETS_URL}/favicon-32x32.png`}
          />
          <link
            rel={'apple-touch-icon'}
            sizes={'180x180'}
            href={`${ASSETS_URL}/apple-touch-icon.png`}
          />
          <link
            rel={'mask-icon'}
            href={`${ASSETS_URL}/safari-pinned-tab.svg`}
            color={'#5bbad5'}
          />

          {/* FONTS: Circular Bold */}
          {/* <link
            rel={'preload'}
            as={'font'}
            type={'font/woff'}
            crossOrigin={'anonymous'}
            href={`${ASSETS_URL}/fonts/lineto-circular-bold.woff`}
          />
          <link
            rel={'preload'}
            as={'font'}
            type={'font/woff2'}
            crossOrigin={'anonymous'}
            href={`${ASSETS_URL}/fonts/lineto-circular-bold.woff2`}
          />
          <link
            rel={'stylesheet'}
            type={'text/css'}
            href={`${ASSETS_URL}/style/circular-bold.css`}
          /> */}

          {/* FONTS: Circular Medium */}
          <link
            rel={'preload'}
            as={'font'}
            type={'font/woff'}
            crossOrigin={'anonymous'}
            href={`${ASSETS_URL}/fonts/circular-medium.woff`}
          />
          <link
            rel={'preload'}
            as={'font'}
            type={'font/woff2'}
            crossOrigin={'anonymous'}
            href={`${ASSETS_URL}/fonts/circular-medium.woff2`}
          />
          <link
            rel={'stylesheet'}
            type={'text/css'}
            href={`${ASSETS_URL}/style/circular-medium.css`}
          />

          <link rel={'manifest'} href={`/static/manifest.json?v=yya2lgM4gb`} />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${GA_TRACKING_ID}', { 'send_page_view': false });
                    `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
