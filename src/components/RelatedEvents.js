import slug from "slug";
import css from "styled-jsx/css";

import RelatedEventsCard from "./RelatedEventsCard";

import getGeohash from "../utils/geohash";

const style = css`
  .RelatedEvents {
  }

  .RelatedEvents-Header {
    text-align: center;
  }
`;

class RelatedEvents extends React.PureComponent {
  render() {
    const { event, place, desktop } = this.props;

    let position = null;
    let placeSlug = null;
    let [depSlug, citySlug] = [];

    if (place) {
      position = getGeohash(place.location);
      placeSlug = place.slug;
      [depSlug, citySlug] = placeSlug.split("_");
    }

    return (
      <div className={`RelatedEvents`}>
        <div className={"RelatedEvents-Header"}>
          <h2>{`Explorer`}</h2>
        </div>

        <RelatedEventsCard
          query={{ position, placeSlug }}
          as={`/events/${depSlug}/${citySlug}`}
          title={event.city}
          desktop={desktop}
        />

        <RelatedEventsCard
          query={{ depCode: event.depCode, placeSlug: depSlug }}
          as={`/events/${depSlug}`}
          title={event.department.name}
          desktop={desktop}
        />

        <style jsx>{style}</style>
      </div>
    );
  }
}

export default RelatedEvents;
