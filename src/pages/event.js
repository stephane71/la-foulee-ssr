import Router from "next/router";
import moment from "moment";
import { connect } from "react-redux";

import CustomError from "./_error";

import EventMetaHeaders from "../headers/event";
import EventDetails from "../components/EventDetails";
import Loader from "../components/Loader";
import JSONLD from "../components/JSONLD";

import getEventDescription from "../utils/getEventDescription";
import getPlaceSlug from "../utils/getPlaceSlug";
import { pageview, event } from "../utils/gtag";
import { getEventStructuredData } from "../utils/structuredData";

import { DESKTOP } from "../enums";
import { setSelectedEvent, addPlace } from "../actions";

class EventPage extends React.PureComponent {
  static async getInitialProps({ isServer, res, query, store, ...context }) {
    const initialProps = { isServer };

    if (isServer) {
      if (res.statusCode === 404)
        return { ...initialProps, error: { code: 404 } };
      if (res.statusCode !== 200)
        return { ...initialProps, error: { code: 500 } };

      const { event } = query;
      store.dispatch(setSelectedEvent(event));
    }

    return { ...initialProps };
  }

  constructor(props) {
    super(props);

    this.state = {
      place: null,
      error: props.error || null
    };

    this.handleSubmitContribution = this.handleSubmitContribution.bind(this);

    if (!props.isServer) window.scrollTo(0, 0);
  }

  componentDidMount() {
    Router.prefetch("/events");

    const { event, query, path } = this.props;
    if (!event && !this.state.error) {
      let { keyword, edition } = query;
      if (!keyword) {
        [, , keyword, edition] = path.split("/");
      }
      this.getEvent({ keyword, edition });
    }

    if (event) {
      this.getEventPlace(event);
    }

    pageview({
      title: "Event details",
      url: window.location.href,
      path: this.props.path
    });
  }

  render() {
    const { error, place } = this.state;
    const { query, path, event, media } = this.props;

    if (error) return <CustomError code={error.code} />;

    if (!event) return <Loader />;

    return (
      <>
        <EventMetaHeaders event={event} path={path} query={query} />

        <EventDetails
          event={event}
          place={place}
          desktop={media === DESKTOP}
          media={media}
          onSubmitContribution={this.handleSubmitContribution}
        />

        <JSONLD
          data={getEventStructuredData(event, {
            description: getEventDescription(event),
            path
          })}
        />
      </>
    );
  }

  async handleSubmitContribution(contribution) {
    const userCreds = await this.props.getCredentials();

    this.props.postEventContribution(
      { contribution, user: userCreds.identityId },
      this.props.event
    );
  }

  async getEvent({ keyword, edition }) {
    try {
      let res = await this.props.getEvent({
        keyword,
        edition: edition ? edition : moment().year()
      });
      this.props.dispatch(setSelectedEvent(res.event));
    } catch (e) {
      this.setState({ error: { code: 404 } });
    }
  }

  async getEventPlace(event) {
    if (!event.department || !event.department.name) return;

    const placeSlug = getPlaceSlug(event);
    let place = this.props.placeMap[placeSlug];

    if (!place) {
      place = await this.props.getPlace({ placeSlug });
      this.props.dispatch(addPlace(place));
    }

    this.setState({ place });
  }
}

function mapStateToProps(state) {
  return {
    event: state.event,
    media: state.media,
    placeMap: state.placeMap
  };
}

export default connect(mapStateToProps)(EventPage);
