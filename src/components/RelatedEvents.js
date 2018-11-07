import slug from "slug";
import css from "styled-jsx/css";

import RelatedEventsCard from "./RelatedEventsCard";

import getGeohash from "../utils/geohash";
import getGMPhotoURL from "../utils/getGMPhotoURL";

import { addDep } from "../actions";

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

    const position = place ? getGeohash(place.location) : null;
    const slugPlace = place ? place.slug : null;

    // <RelatedEventsCard
    //   query={{
    //     depCode: event.depCode,
    //     place: department && department.place_id
    //   }}
    //   as={`/events/department/${event.depCode}`}
    //   title={event.department.name}
    //   image={department && getGMPhotoURL(department)}
    //   desktop={desktop}
    // />

    return (
      <div className={`RelatedEvents`}>
        <div className={"RelatedEvents-Header"}>
          <h2>{`Explorer`}</h2>
        </div>

        <RelatedEventsCard
          query={{ position, place: slugPlace }}
          as={`/events/${slug(event.city, { lower: true })}`}
          title={event.city}
          image={place && getGMPhotoURL(place)}
          desktop={desktop}
        />

        <style jsx>{style}</style>
      </div>
    );
  }
}

export default RelatedEvents;
