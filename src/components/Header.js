// should not be added !
// when using babel-plugin-inline-react-svg (added for project) && babel-plugin-react-require (added from next.js)
// read here https://github.com/kesne/babel-plugin-inline-react-svg/issues/31#issuecomment-342264348
import React from 'react';

import LogoTonic from '../svgs/lafoulee-tonic.svg';
import MenuIcon from '../svgs/ic_menu_black_24px.svg';

import { HEIGHT_APPBAR, getSpacing } from '../styles-variables';
import { dominant, white } from '../colors';
import { ICON_SIZE } from '../enums';

const HEIGHT_LOGO_APP_HEADER = HEIGHT_APPBAR - 8;

/*
 * This calculation is based on this pattern:
 *  | Icon | Logo | Icon |
 * Each Icon: 24 px + 12px padding (right & left)
 */
const WIDTH_DIFF_CENTER_LOGO_WRAPPER = 2 * (ICON_SIZE + getSpacing(`s`) * 2);

const Header = ({ onClickHeaderLogo, onClickMenu }) => (
  <div className={'Header'}>
    <div className={'Header-content'}>
      <div className={'Header-menuWrapper'} onClick={onClickMenu}>
        <MenuIcon style={{ fill: white, verticalAlign: 'middle' }} />
      </div>
      <div className={'Header-svgWrapper'} onClick={onClickHeaderLogo}>
        <LogoTonic height={`${HEIGHT_LOGO_APP_HEADER}px`} />
      </div>
    </div>

    <style jsx>{`
      .Header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        max-width: 100vw;
        height: ${HEIGHT_APPBAR}px;
      }

      .Header-content {
        padding: 0 ${getSpacing(`s`)}px;
        background-color: ${dominant};
        height: 100%;
        display: flex;
        align-items: center;
      }

      .Header-menuWrapper {
        padding: 0 ${getSpacing(`s`)}px;
      }

      .Header-menuWrapper:hover {
        cursor: pointer;
      }

      .Header-svgWrapper {
        height: ${HEIGHT_LOGO_APP_HEADER}px;
        width: calc(100% - ${WIDTH_DIFF_CENTER_LOGO_WRAPPER}px);
        text-align: center;
      }
    `}</style>
  </div>
);

export default Header;
