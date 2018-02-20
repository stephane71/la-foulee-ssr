import css from 'styled-jsx/css';

import {
  BaseFontSize,
  BaseLineHeight,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  SMALL,
  LISTS
} from './styles-variables';

export default css`
  html,
  body {
    min-height: 100vh;
    height: 1px;
    width: 100%;
    margin: 0;
    font-size: ${BaseFontSize}px;
    line-height: ${BaseLineHeight}px;
  }

  body,
  button {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    color: #3a3d42;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
    height: 1px;
  }

  .no-scroll {
    overflow: hidden;
  }

  .wrapper-hidden {
    display: none;
  }

  .wrapper-show {
    height: 100%;
  }

  *,
  *:after,
  *:before {
    box-sizing: border-box;
  }

  h1 {
    line-height: ${H1.lineHeight}px;
    font-size: ${H1.fontSize}px;
    margin-bottom: ${H1.marginBottom}px;
    margin-top: ${H1.marginTop}px;
  }

  h2 {
    line-height: ${H2.lineHeight}px;
    font-size: ${H2.fontSize}px;
    margin-bottom: ${H2.marginBottom}px;
    margin-top: ${H2.marginTop}px;
  }

  h3 {
    line-height: ${H3.lineHeight}px;
    font-size: ${H3.fontSize}px;
    margin-bottom: ${H3.marginBottom}px;
    margin-top: ${H3.marginTop}px;
  }

  h4 {
    line-height: ${H4.lineHeight}px;
    font-size: ${H4.fontSize}px;
    margin-bottom: ${H4.marginBottom}px;
    margin-top: ${H4.marginTop}px;
  }

  h5 {
    line-height: ${H5.lineHeight}px;
    font-size: ${H5.fontSize}px;
    margin-top: ${H5.marginTop}px;
  }

  h6 {
    line-height: ${H6.lineHeight}px;
    font-size: ${H6.fontSize}px;
    margin-top: ${H6.marginTop}px;
  }

  p {
    margin-bottom: ${P.marginBottom}px;
  }

  ul,
  ol {
    margin-bottom: ${LISTS.marginBottom}px;
  }

  select,
  button {
    font-size: ${BaseFontSize}px;
    line-height: ${BaseLineHeight}px;
  }
`;
