import React from "react";
import Router from "next/router";
import css from "styled-jsx/css";

import IconWrapper from "./IconWrapper";

import LogoTonic from "../svgs/lafoulee-tonic.svg";
import SearchIcon from "../svgs/ic_search_black_24px.svg";
import ArrowBackIcon from "../svgs/ic_arrow_back_black_24px.svg";
import HomeIcon from "../svgs/baseline-home-24px.svg";

import { getSpacing } from "../styles-variables";
import { dominant, white } from "../colors";
import { ICON_SIZE, HEIGHT_APPBAR, MAX_WIDTH } from "../enums";

SearchIcon = IconWrapper(SearchIcon);
ArrowBackIcon = IconWrapper(ArrowBackIcon);
HomeIcon = IconWrapper(HomeIcon);
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
    width: 100%;
    z-index: 10;
    height: ${HEIGHT_APPBAR}px;
    background-color: ${dominant};
  }

  .Header-Content {
    padding: 0 ${getSpacing(`s`)}px;
    height: 100%;
    display: flex;
    align-items: center;
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;
  }

  .Header-SideIcon {
    padding: 0 ${getSpacing(`s`)}px;
  }

  .Header-SideIcon:hover {
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
  showBackArrow,
  isHomeRoute
}) => (
  <div className={"Header"}>
    <div className={"Header-Content"}>
      <div
        className={`Header-SideIcon ${isHomeRoute ? "hidden" : ""}`}
        onClick={showBackArrow ? () => Router.back() : onClickHeaderLogo}
      >
        {showBackArrow ? <ArrowBackIcon /> : <HomeIcon />}
      </div>

      <div className={"Header-svgWrapper"} onClick={onClickHeaderLogo}>
        <LogoTonic
          height={`${HEIGHT_LOGO_APP_HEADER}px`}
          width={`${WIDTH_LOGO_APP_HEADER}px`}
        />
      </div>

      {!isHomeRoute && (
        <div className={"Header-SideIcon"} onClick={onClickSearch}>
          <SearchIcon />
        </div>
      )}
    </div>

    <style jsx>{style}</style>
  </div>
);

export default Header;
