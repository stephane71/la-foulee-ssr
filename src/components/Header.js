// should not be added !
// when using babel-plugin-inline-react-svg (added for project) && babel-plugin-react-require (added from next.js)
// read here https://github.com/kesne/babel-plugin-inline-react-svg/issues/31#issuecomment-342264348
import React from 'react';

import LogoTonic from '../svgs/lafoulee-tonic.svg';

import { HEIGHT_APPBAR, getSpacing } from '../styles-variables';
import { dominant } from '../colors';
import { ICON_SIZE } from '../enums';

const HEIGHT_LOGO_APP_HEADER = HEIGHT_APPBAR - 8;

/*
 * This calculation is based on this pattern:
 *  | Icon | Logo | Icon |
 * Each Icon: 24 px + 12px padding (right & left)
 * Content padding: 12 px (right & left)
 */
const WIDTH_DIFF_CENTER_LOGO_WRAPPER =
  ICON_SIZE * 2 + getSpacing(`s`) * 4 + getSpacing(`s`) * 2;

const Header = ({ onClickHeaderLogo }) => (
  <div className={'header-root'}>
    <div className={'header-content'}>
      <div className={'svg-wrapper'} onClick={onClickHeaderLogo}>
        <LogoTonic height={`${HEIGHT_LOGO_APP_HEADER}px`} />
      </div>
    </div>

    <style jsx>{`
      .header-root {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        max-width: 100vw;
        height: ${HEIGHT_APPBAR}px;
      }

      .header-content {
        padding: 0 ${getSpacing(`s`)}px;
        background-color: ${dominant};
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .svg-wrapper {
        height: ${HEIGHT_LOGO_APP_HEADER}px;
        width: calc(100% - ${WIDTH_DIFF_CENTER_LOGO_WRAPPER}px);
        text-align: center;
      }
    `}</style>
  </div>
);

export default Header;
