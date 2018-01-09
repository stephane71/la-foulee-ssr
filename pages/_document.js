import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

const ASSETS_URL = process.env.ASSETS_URL;

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
          />
          <meta name="mobile-web-app-capable" content="yes" />

          {/* ICONS */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${ASSETS_URL}/apple-touch-icon.png?v=yya2lgM4gb`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${ASSETS_URL}/favicon-32x32.png?v=yya2lgM4gb`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${ASSETS_URL}/favicon-16x16.png?v=yya2lgM4gb`}
          />
          <link
            rel="mask-icon"
            href={`${ASSETS_URL}/safari-pinned-tab.svg?v=yya2lgM4gb`}
            color="#5bbad5"
          />
          <link
            rel="shortcut icon"
            href={`${ASSETS_URL}/favicon.ico?v=yya2lgM4gb`}
          />

          {/* FONTS */}
          <link
            crossorigin="anonymous"
            rel="preload"
            as="font"
            type="font/eot"
            href={`${ASSETS_URL}/fonts/lineto-circular-bold.eot`}
            crossorigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            type="font/woff"
            href={`${ASSETS_URL}/fonts/lineto-circular-bold.woff`}
            crossorigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            href={`${ASSETS_URL}/fonts/lineto-circular-bold.woff2`}
            crossorigin="anonymous"
          />

          <link rel="stylesheet" type="text/css" href={`${ASSETS_URL}/style/circular-bold.css`} />

          <link rel="manifest" href={`/static/manifest.json?v=yya2lgM4gb`} />
          <meta name="theme-color" content="#ddff31" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
