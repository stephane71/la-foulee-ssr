import React from "react";
import debounce from "lodash.debounce";
import css from "styled-jsx/css";

import { dominant, white } from "../colors";
import { HEIGHT_APPBAR, MAX_WIDTH } from "../enums";
import { getSpacing } from "../styles-variables";

import Input, { KEYBOARD_NAV_UP, KEYBOARD_NAV_DOWN } from "./Input";
import IconWrapper from "./IconWrapper";

import PlaceAutocomplete from "./PlaceAutocomplete";
import SearchList from "./SearchList";
import SearchPlaceItem from "./SearchPlaceItem";
import SearchPlaceItemPosition from "./SearchPlaceItemPosition";

import IconArrowBack from "../svgs/ic_arrow_back_black_24px.svg";
import IconCross from "../svgs/baseline-clear-24px.svg";

IconArrowBack = IconWrapper(IconArrowBack);
IconCross = IconWrapper(IconCross);

const BIG_CITIES = [
  {
    name: "Bordeaux",
    match: "Bordeaux",
    county: "Gironde",
    location: { lat: 44.8378, lng: -0.579512 }
  },

  {
    name: "Lille",
    match: "Lille",
    county: "Nord",
    location: { lat: 50.632, lng: 3.05749 }
  },
  {
    name: "Lyon",
    match: "Lyon",
    county: "Rhône",
    location: { lat: 45.7539, lng: 4.84699 }
  },
  {
    name: "Marseille",
    match: "Marseille",
    county: "Bouches-du-Rhône",
    location: { lat: 43.2954, lng: 5.3631 }
  },
  {
    name: "Paris",
    match: "Paris",
    county: "Paris",
    location: { lat: 48.8546, lng: 2.3477 }
  }
];

const style = css`
  .Search {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: ${MAX_WIDTH}px;
    z-index: 100;
    left: 50%;
    transform: translate(-50%);
  }

  .Search-Header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${getSpacing("s")}px ${getSpacing("m")}px;
    background-color: ${dominant};
    height: ${HEIGHT_APPBAR}px;
  }

  .Search-Content {
    padding: ${getSpacing("s")}px;
  }

  .Search-Icon--paddingRight {
    padding-right: ${getSpacing("s")}px;
  }

  .Search-Icon--paddingLeft {
    padding-left: ${getSpacing("s")}px;
  }
`;

class Search extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      input: ""
    };

    this.handleInputReset = this.handleInputReset.bind(this);

    this.handleLocationInputUpdate = this.handleLocationInputUpdate.bind(this);
    this.handleLocationInputUpdate = debounce(
      this.handleLocationInputUpdate,
      250
    );
  }

  render() {
    const { onLeave, onSelectPlace } = this.props;
    const { input } = this.state;

    return (
      <div className={"Search"}>
        <div className={"Search-Header"}>
          <div
            className={"Search-Icon--paddingRight"}
            onClick={() => onLeave()}
          >
            <IconArrowBack fill={white} />
          </div>
          <Input
            placeholder={"ex: Saint-Malo"}
            onChange={this.handleLocationInputUpdate}
            reset={!input}
            focus={true}
          />
          {input && (
            <div
              className={"Search-Icon--paddingLeft"}
              onClick={this.handleInputReset}
            >
              <IconCross fill={white} />
            </div>
          )}
        </div>

        <div className={"Search-Content"}>
          <SearchList data={[0]} onClick={onSelectPlace}>
            {() => <SearchPlaceItemPosition />}
          </SearchList>

          <PlaceAutocomplete input={input}>
            {({ predictions }) => {
              predictions = predictions.length ? predictions : BIG_CITIES;
              this.nbItems = predictions.length + 1;
              return (
                <SearchList data={predictions} onClick={onSelectPlace}>
                  {prediction => <SearchPlaceItem prediction={prediction} />}
                </SearchList>
              );
            }}
          </PlaceAutocomplete>
        </div>

        <style jsx>{style}</style>
      </div>
    );
  }

  nbItems = 0;

  handleInputReset() {
    this.setState({ input: "" });
  }

  handleLocationInputUpdate(value) {
    this.setState({ input: value });
  }
}

export default Search;
