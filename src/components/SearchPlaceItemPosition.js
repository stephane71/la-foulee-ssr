import React from "react";
import css from "styled-jsx/css";

import IconWrapper from "./IconWrapper";
import IconNearMe from "../svgs/baseline-near_me-24px.svg";

import { SECONDARY_COLOR } from "../colors";
import { getSpacing } from "../styles-variables";

IconNearMe = IconWrapper(IconNearMe);

const style = css`
  span {
    padding-left: ${getSpacing("xs")}px;
  }
`;

const SearchPlaceItemPosition = () => (
  <div className={"SearchPlaceItemPosition"}>
    <IconNearMe fill={SECONDARY_COLOR} />
    <span>{"Votre position"}</span>

    <style jsx>{style}</style>
  </div>
);

export default SearchPlaceItemPosition;
