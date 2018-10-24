import slug from "slug";
import Link from "next/link";
import css from "styled-jsx/css";
import getConfig from "next/config";
import moment from "moment";
import { connect } from "react-redux";

import withGoogleMaps from "./withGoogleMaps";
import { MOBILE_MIN_WIDTH, MOBILE_MAX_WIDTH } from "./EventDetailsMobile";

import getGeohash from "../utils/geohash";
import { getSpacing } from "../styles-variables";
import { white, getColor } from "../colors";
import { addPlace } from "../actions";

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;

const IMAGE_CARD_DESKTOP_WIDTH = 200;
const IMAGE_CARD_DESKTOP_HEIGHT = 125;

const IMAGE_CARD_MOBILE_WIDTH = 120;

// From RelatedEvents-CardBody: 24 * 3 (h6 on 2lines + span) + 24 * 2 (card body padding)
const IMAGE_CARD_HEIGHT = 120;

const DATE_FORMAT_DESKTOP = "DD MMMM";
const DATE_FORMAT_MOBILE = "DD MMM";

const RelatedEventsCardStyle = css`
  .RelatedEvents-CardLinkWrapper {
    text-decoration: none;
    color: inherit;
  }

  .RelatedEvents-Card {
    margin-top: ${getSpacing("m")}px;
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

const RelatedEventsCard = ({ query, as, image, title, desktop }) => (
  <Link
    href={{
      pathname: "/events",
      query
    }}
    as={as}
  >
    <a className={"RelatedEvents-CardLinkWrapper"}>
      <div className={"RelatedEvents-Card"}>
        <div className={"RelatedEvents-CardImage"}>
          <img src={image} className={"RelatedEvents-Image"} />
        </div>
        <div className={"RelatedEvents-CardBody"}>
          <h6>{title}</h6>
          <span>{`À partir du ${moment().format(
            desktop ? DATE_FORMAT_DESKTOP : DATE_FORMAT_MOBILE
          )}`}</span>
        </div>
      </div>
      <style jsx>{RelatedEventsCardStyle}</style>
      <style jsx>{`
        .RelatedEvents-CardImage {
          width: ${desktop
            ? IMAGE_CARD_DESKTOP_WIDTH
            : IMAGE_CARD_MOBILE_WIDTH}px;
        }
      `}</style>
    </a>
  </Link>
);

const RelatedEventsStyle = css`
  .RelatedEvents {
  }

  .RelatedEvents--mobile {
    min-width: ${MOBILE_MIN_WIDTH}px;
    max-width: ${MOBILE_MAX_WIDTH}px;
    margin: 0 auto;
  }

  .RelatedEvents-Header {
    text-align: center;
  }
`;

class RelatedEvents extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      city: null,
      department: null
    };
  }

  componentDidMount() {
    if (this.props.googleMapsServiceReady) {
      const { event } = this.props;

      this.getPlace(event);
      this.getDepartment(event.department.name);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.googleMapsServiceReady &&
      !this.props.googleMapsServiceReady
    ) {
      const { event } = this.props;

      this.getPlace(event);
      this.getDepartment(event.department.name);
    }
  }

  render() {
    const { event, desktop } = this.props;
    const { city, department } = this.state;

    const position = city ? getGeohash(city.location) : null;

    return (
      <div
        className={`RelatedEvents RelatedEvents--${
          desktop ? "desktop" : "mobile"
        }`}
      >
        <div className={"RelatedEvents-Header"}>
          <h2>{`Explorer`}</h2>
        </div>

        <RelatedEventsCard
          query={{ position, place: event.place_id }}
          as={`/events/${slug(event.city, { lower: true })}`}
          title={`Autour de ${event.city}`}
          image={city && this.getPhoto(city)}
        />

        <RelatedEventsCard
          query={{
            depCode: event.depCode,
            place: department && department.place_id
          }}
          as={`/events/department/${event.depCode}`}
          title={`Dans le département\n${event.department.name}`}
          image={department && this.getPhoto(department)}
        />

        <style jsx>{RelatedEventsStyle}</style>
      </div>
    );
  }

  async getDepartment(department) {
    const predictions = await this.props.getPredictions(department, "regions");
    const dep = predictions.find(({ terms }) => terms[0].value === department);

    this.getPlace(dep, "department");
  }

  async getPlace({ place_id }, type = "city") {
    const place = await this.props.getDetails(place_id);

    this.props.dispatch(addPlace(place));
    this.setState({ [type]: place });
  }

  getPhoto(place) {
    if (place && place.photos) {
      return place.photos[0].photo_url
        ? place.photos[0].photo_url
        : place.photos[0].getUrl({
            maxWidth: IMAGE_CARD_DESKTOP_WIDTH,
            maxHeight: IMAGE_CARD_DESKTOP_HEIGHT
          });
    }
    return null;
  }
}

const RelatedEventsWithGM = withGoogleMaps(RelatedEvents);
export default connect()(RelatedEventsWithGM);
