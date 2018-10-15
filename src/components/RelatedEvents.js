import slug from "slug";
import css from "styled-jsx/css";
import getConfig from "next/config";
import moment from "moment";

import withGoogleMaps from "./withGoogleMaps";
import { MOBILE_MIN_WIDTH, MOBILE_MAX_WIDTH } from "./EventDetailsMobile";

import { getSpacing } from "../styles-variables";
import { white, getColor } from "../colors";
import { DATE_FORMAT } from "../enums";

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;

const IMAGE_CARD_DESKTOP_WIDTH = 200;
const IMAGE_CARD_DESKTOP_HEIGHT = 125;

const IMAGE_CARD_MOBILE_WIDTH = 120;

// From RelatedEvents-CardBody: 24 * 2 (h6 + span) + 24 * 2 (card body padding)
const IMAGE_CARD_HEIGHT = 96;

const style = css`
  .RelatedEvents {
    padding: ${getSpacing("m")}px 0;
  }

  .RelatedEvents--mobile {
    min-width: ${MOBILE_MIN_WIDTH}px;
    max-width: ${MOBILE_MAX_WIDTH}px;
    margin: 0 auto;
  }

  .RelatedEvents-Header {
    text-align: center;
  }

  .RelatedEvents-CardLinkWrapper {
    text-decoration: none;
    color: inherit;
  }

  .RelatedEvents-Card {
    display: flex;
    background-color: ${white};
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  }

  .RelatedEvents-CardImage {
    height: ${IMAGE_CARD_HEIGHT}px;
    flex-shrink: 0;
    background: #eeedf2;
  }

  .RelatedEvents-Image {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }

  .RelatedEvents-CardBody {
    display: flex;
    flex-direction: column;
    justify-content: center;

    flex-shrink: 1;
    width: 100%;
    padding: ${getSpacing("m")}px ${getSpacing("s")}px;
  }

  .RelatedEvents-CardBody > h6 {
    margin: 0;
  }

  .RelatedEvents-CardBody > span {
    color: ${getColor("darkGrey", "tonic")};
  }
`;

class RelatedEvents extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      city: null
    };

    this.getCity = this.getCity.bind(this);
  }

  componentDidMount() {
    if (this.props.googleMapsServiceReady) {
      this.getCity(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.googleMapsServiceReady &&
      !this.props.googleMapsServiceReady
    ) {
      this.getCity(nextProps);
    }
  }

  render() {
    const { event, desktop } = this.props;
    const { city } = this.state;

    return (
      <div
        className={`RelatedEvents RelatedEvents--${
          desktop ? "desktop" : "mobile"
        }`}
      >
        <div className={"RelatedEvents-Header"}>
          <h2>{`Explorer`}</h2>
        </div>
        <a
          href={`${APP_URL}/events/${slug(event.city, { lower: true })}`}
          className={"RelatedEvents-CardLinkWrapper"}
        >
          <div className={"RelatedEvents-Card"}>
            <div className={"RelatedEvents-CardImage"}>
              <img
                src={city && this.getPhoto(city)}
                className={"RelatedEvents-Image"}
              />
            </div>
            <div className={"RelatedEvents-CardBody"}>
              <h6>{`Autour de ${this.props.event.city}`}</h6>
              <span>{`À partir du ${moment().format(DATE_FORMAT)}`}</span>
            </div>
          </div>
        </a>

        <style jsx>{style}</style>
        <style jsx>{`
          .RelatedEvents-CardImage {
            width: ${desktop
              ? IMAGE_CARD_DESKTOP_WIDTH
              : IMAGE_CARD_MOBILE_WIDTH}px;
          }
        `}</style>
      </div>
    );
  }

  async getCity({ event, getDetails }) {
    const city = await getDetails(event.place_id);
    this.setState({ city });
  }

  getPhoto(city) {
    if (city && city.photos) {
      return city.photos[0].photo_url
        ? city.photos[0].photo_url
        : city.photos[0].getUrl({
            maxWidth: IMAGE_CARD_DESKTOP_WIDTH,
            maxHeight: IMAGE_CARD_DESKTOP_HEIGHT
          });
    }
    return null;
  }
}

export default withGoogleMaps(RelatedEvents);
