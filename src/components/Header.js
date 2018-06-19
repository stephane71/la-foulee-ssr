import Router from 'next/router';
import css from 'styled-jsx/css';

import LogoTonic from '../svgs/lafoulee-tonic.svg';
import SearchIcon from '../svgs/ic_search_black_24px.svg';
import ArrowBackIcon from '../svgs/ic_arrow_back_black_24px.svg';
import HomeIcon from '../svgs/baseline-home-24px.svg';

import { getSpacing } from '../styles-variables';
import { dominant, white } from '../colors';
import { ICON_SIZE, HEIGHT_APPBAR, MAX_WIDTH } from '../enums';

/*
 * This calculation is based on this pattern:
 *  | Icon | Logo | Icon |
 * Each Icon: 24 px + 12px padding (right & left)
 */
const WIDTH_DIFF_CENTER_LOGO_WRAPPER = 2 * (ICON_SIZE + getSpacing(`s`) * 2);
const HEIGHT_LOGO_APP_HEADER = HEIGHT_APPBAR - 36;
const WIDTH_LOGO_APP_HEADER = 108;

const style = css`
  .Header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    height: ${HEIGHT_APPBAR}px;
    background-color: ${dominant};
  }

  .Header-content {
    padding: 0 ${getSpacing(`s`)}px;
    height: 100%;
    display: flex;
    align-items: center;
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;
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

  .Header-svgWrapper:hover {
    cursor: pointer;
  }
`;

const Header = ({
  onClickHeaderLogo,
  onClickSearch,
  showSearchTrigger,
  showBackArrow
}) => (
  <div className={'Header'}>
    <div className={'Header-content'}>
      {showBackArrow ? (
        <div className={'Header-menuWrapper'} onClick={() => Router.back()}>
          <ArrowBackIcon style={{ fill: white, verticalAlign: 'middle' }} />
        </div>
      ) : (
        <div className={'Header-menuWrapper'} onClick={onClickHeaderLogo}>
          <HomeIcon style={{ fill: white, verticalAlign: 'middle' }} />
        </div>
      )}

      <div className={'Header-svgWrapper'} onClick={onClickHeaderLogo}>
        <LogoTonic
          height={`${HEIGHT_LOGO_APP_HEADER}px`}
          width={`${WIDTH_LOGO_APP_HEADER}px`}
        />
      </div>

      {showSearchTrigger && (
        <div className={'Header-menuWrapper'} onClick={onClickSearch}>
          <SearchIcon style={{ fill: white, verticalAlign: 'middle' }} />
        </div>
      )}
    </div>

    <style jsx>{style}</style>
  </div>
);

export default Header;
