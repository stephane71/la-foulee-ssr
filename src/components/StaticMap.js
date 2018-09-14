import css from 'styled-jsx/css';

import buildGoogleMapStaticImage from '../utils/buildGoogleMapStaticImage';
import {
  MOBILE_STATIC_MAP,
  DESKTOP_STATIC_MAP
} from '../utils/buildGoogleMapStaticImage';

import { BORDER_RADIUS } from '../enums';

const style = css`
  .StaticMap-Image {
    width: 100%;
    height: 100%;
    border-radius: ${BORDER_RADIUS}px;
  }
`;

const StaticMap = ({ event, desktop, color, isServer }) => (
  <div className={'StaticMap'}>
    {!isServer && (
      <img
        className={'StaticMap-Image'}
        src={buildGoogleMapStaticImage(event, desktop)}
      />
    )}

    <style jsx>{style}</style>
    <style jsx>{`
      .StaticMap {
        height: ${desktop
          ? DESKTOP_STATIC_MAP.height
          : MOBILE_STATIC_MAP.height}px;
        width: ${desktop
          ? DESKTOP_STATIC_MAP.width
          : MOBILE_STATIC_MAP.width}px;
        border: 1px solid ${color};
        border-radius: ${BORDER_RADIUS}px;
        background-color: ${color};
      }
    `}</style>
  </div>
);

export default StaticMap;
