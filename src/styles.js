import css from 'styled-jsx/css';

import {
  getSpacing,
  getFontSize,
  BaseFontSize,
  BaseLineHeight,
  BaseRadius,
  Base,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  LISTS
} from './styles-variables';
import { TABLE_BORDER_COLOR, APP_BACKGROUND_COLOR, dominant } from './colors';
import { HEIGHT_APPBAR } from './enums';

export default css`
  html,
  body {
    height: 100%;
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

  #__next {
    background: ${APP_BACKGROUND_COLOR};
    padding-top: ${HEIGHT_APPBAR}px;
    overflow: auto;
    height: 100%;
  }

  .VirtualizedList-List {
    padding-bottom: ${getSpacing('m')}px;
    outline: none;
  }

  .prevent-scroll {
    pointer-events: none;
  }

  .hidden {
    visibility: hidden;
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

  .Button {
    background: ${dominant};
    color: #F4F5F7;
    text-transform: uppercase;
    font-size: ${getFontSize('s')}px;
    padding: ${getSpacing('s')}px ${getSpacing('m')}px;
    text-decoration: none;
    border-radius 24px;
    outline: none;
  }

  .Button--fixed {
    box-shadow: 0 10px 20px 0 rgba(38,74,67,0.05);
  }

  .Button--square,
  .Button--circle {
    padding: ${getSpacing('s')}px;
  }

  .Button--flat {
    background: none;
  }

  .Button--circle {
    border-radius: 50%;
  }

  .Overlay-closeButton {
    background: #0c1715;
    cursor: pointer;
  }

  .List {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .List-Item {
    text-transform: uppercase;
    padding: ${getSpacing('s')}px;
    cursor: pointer;
    font-size: ${getFontSize('s')}px;
    line-height: ${BaseLineHeight}px;
  }

  .List-Item + .List-Item {
    margin-top: ${getSpacing('s')}px;
  }

  /* Need to be global ? Used only in Event details page */

  .Table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .Table-DataHeader,
  .Table-DataCell {
    padding: ${getSpacing('s')}px ${getSpacing('xs')}px;
  }

  .Table-DataHeader {
    font-weight: 300;
    font-size: ${getFontSize('xs')}px;
    text-transform: uppercase;
    border-bottom: 1px solid ${TABLE_BORDER_COLOR};
  }

  .Table-DataCell {
    font-weight: 300;
    vertical-align: text-top;
    border-bottom: 1px solid ${TABLE_BORDER_COLOR};
  }

  .Table-DataCell--bold {
    font-weight: 500;
  }

  .Table-DataCell:first-child {
    border-radius: ${BaseRadius}px 0 0 ${BaseRadius}px;
  }

  .Table-DataCell:last-child {
    border-radius: 0 ${BaseRadius}px ${BaseRadius}px 0;
  }
`;
