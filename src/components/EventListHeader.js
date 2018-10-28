import css from "styled-jsx/css";
import { withRouter } from "next/router";

import { SelectedPlaceContext } from "./Layout";

import { getSpacing } from "../styles-variables";
import {
  BORDER_RADIUS_LIST_ITEM,
  MAX_WIDTH_CITY_PHOTO,
  MAX_HEIGHT_CITY_PHOTO
} from "../enums";
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
  constructor(props) {
    super(props);

    this.state = {
      photo: this.getPhoto(props.city),
      previousPhoto: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.city !== nextProps.city) {
      const photo = this.getPhoto(nextProps.city);

      this.setState({ previousPhoto: this.state.photo, photo });
    }
  }

  render() {
    const { photo, previousPhoto } = this.state;
    const { city, nbItems, router } = this.props;
    const { query } = router;

    if (!city) return null;

    const backgroundCurrent = photo
      ? `url(${photo}) center center no-repeat,`
      : "";
    const backgroundPrevious = previousPhoto
      ? `url(${previousPhoto}) center center no-repeat,`
      : "";

    const description = query.depCode
      ? "dans ce département"
      : `autour de ${city.name}`;

    return (
      <div className={`EventListHeader EventListHeader-Image`}>
        <h1 className={"EventListHeader-Title"}>{city.name}</h1>
        <div>{`${nbItems} événements ${description}`}</div>

        <style jsx>{style}</style>
        <style jsx>{`
          .EventListHeader-Image {
            background: ${backgroundCurrent} ${photo ? backgroundPrevious : ""}
              ${dominant};
            background-size: cover;
          }
        `}</style>
      </div>
    );
  }

  getPhoto(city) {
    if (city && city.photos) {
      return city.photos[0].photo_url
        ? city.photos[0].photo_url
        : city.photos[0].getUrl({
            maxWidth: MAX_WIDTH_CITY_PHOTO,
            maxHeight: MAX_HEIGHT_CITY_PHOTO
          });
    }
    return null;
  }
}

const EventListHeaderWithRouter = withRouter(EventListHeader);

export default props => (
  <SelectedPlaceContext.Consumer>
    {city => <EventListHeaderWithRouter {...props} city={city} />}
  </SelectedPlaceContext.Consumer>
);
