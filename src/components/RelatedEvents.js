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
    let slugPlace = null;
    let [department, city] = [];

    if (place) {
      position = getGeohash(place.location);
      slugPlace = place.slug;
      [department, city] = slugPlace.split("_");
    }

    // <RelatedEventsCard
    //   query={{
    //     depCode: event.depCode,
    //     place: department && department.place_id
    //   }}
    //   as={`/events/department/${event.depCode}`}
    //   title={event.department.name}
    //   desktop={desktop}
    // />

    return (
      <div className={`RelatedEvents`}>
        <div className={"RelatedEvents-Header"}>
          <h2>{`Explorer`}</h2>
        </div>

        <RelatedEventsCard
          query={{ position, place: slugPlace }}
          as={`/events/${department}/${city}`}
          title={event.city}
          desktop={desktop}
        />

        <style jsx>{style}</style>
      </div>
    );
  }
}

export default RelatedEvents;
