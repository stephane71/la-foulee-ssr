import React from "react";
import css from "styled-jsx/css";

import Logo from "../svgs/glyph.dominant.144x144.svg";

import { MAX_WIDTH } from "../enums";
import { getSpacing, getFontSize } from "../styles-variables";
import { getColor, APP_COLOR } from "../colors";

const FOOTER_LOGO_SIZE = 24;

const style = css`
  .AppFooter {
    max-width: ${MAX_WIDTH}px;
    margin: 0 auto;
    padding: ${getSpacing("m")}px ${getSpacing("s")}px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .AppFooter--font {
    font-size: ${getFontSize("xs")}px;
    font-weight: 600;
    color: ${getColor("darkGrey", "tonic")};
  }

  .AppFooter-Contact {
    display: flex;
    flex-direction: column;
    padding: ${getSpacing("m")}px 0;
  }

  .AppFooter-Contact > span {
    color: ${APP_COLOR};
  }

  .AppFooter-contactLink {
    text-decoration: none;
    color: ${getColor("darkGrey", "tonic")};
  }

  .AppFooter-Copyright {
    display: flex;
    align-items: center;
    border-top: 1px solid ${getColor("lightGrey", "tonic")};
    padding-top: ${getSpacing("s")}px;
  }
`;

const AppFooter = () => (
  <div className={"AppFooter AppFooter--font"}>
    <div className={"AppFooter-Contact"}>
      <span>{"Contact"}</span>
      <a
        className={"AppFooter-contactLink"}
        href={"mailto:stephane@la-foulee.com"}
      >
        {"stephane@la-foulee.com"}
      </a>
    </div>

    <div className={"AppFooter-Copyright"}>
      <Logo
        width={FOOTER_LOGO_SIZE}
        height={FOOTER_LOGO_SIZE}
        style={{ opacity: 0.33, marginRight: getSpacing("xxs") }}
      />
      <span>{"© 2018 La Foulée"}</span>
    </div>
    <style jsx>{style}</style>
  </div>
);

export default AppFooter;
