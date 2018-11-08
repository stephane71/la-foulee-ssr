import css from "styled-jsx/css";
import { withRouter } from "next/router";

import { SelectedPlaceContext } from "./Layout";

import { getSpacing } from "../styles-variables";
import { BORDER_RADIUS_LIST_ITEM } from "../enums";
import { dominant, white } from "../colors";

const style = css`
  .EventListHeader {
    margin: ${getSpacing("s")}px;
    padding: ${getSpacing("m")}px ${getSpacing("s")}px;
    border-radius: ${BORDER_RADIUS_LIST_ITEM}px;
    color: ${white};
    text-shadow: black 1px 0 10px;
    background-color: ${dominant};
    position: relative;
    z-index: 1;
  }

  .EventListHeader:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 69%);
    border-radius: ${BORDER_RADIUS_LIST_ITEM}px;
    z-index: -1;
  }

  .EventListHeader-Title {
    margin: ${getSpacing("s")}px 0;
  }
`;

class EventListHeader extends React.PureComponent {
  render() {
    const { city, nbItems, router } = this.props;
    const { query } = router;

    if (!city) return null;

    const description = query.depCode
      ? "dans ce département"
      : `autour de ${city.name}`;

    return (
      <div className={`EventListHeader`}>
        <h1 className={"EventListHeader-Title"}>{city.name}</h1>
        <div>{`${nbItems} événements ${description}`}</div>

        <style jsx>{style}</style>
      </div>
    );
  }
}

const EventListHeaderWithRouter = withRouter(EventListHeader);

export default props => (
  <SelectedPlaceContext.Consumer>
    {city => <EventListHeaderWithRouter {...props} city={city} />}
  </SelectedPlaceContext.Consumer>
);
