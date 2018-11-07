import dynamic from "next/dynamic";
import css from "styled-jsx/css";

import { event } from "../utils/gtag";

import { getSpacing } from "../styles-variables";
import {
  MAX_WIDTH,
  DESKTOP,
  MOBILE,
  EVENT_DETAILS_MOBILE_MIN_WIDTH,
  EVENT_DETAILS_MOBILE_MAX_WIDTH
} from "../enums";

const EventDetailsMobile = dynamic(import("../components/EventDetailsMobile"), {
  loading: () => null
});
const EventDetailsDesktop = dynamic(
  import("../components/EventDetailsDesktop"),
  {
    loading: () => null
  }
);
const RelatedEvents = dynamic(import("../components/RelatedEvents"), {
  loading: () => null
});

function handleClickOrgaLink(href = "") {
  event({
    action: "Orga Link",
    category: "Event",
    label: "Click on orga link",
    value: href
  });
}

const style = css`
  @media (min-width: ${MAX_WIDTH}px) {
    .EventPage {
      overflow-y: initial;
      margin: auto 0;
      padding-top: ${getSpacing("m")}px;
    }
  }

  @media (max-width: ${MAX_WIDTH}px) {
    .EventPage-RelatedEvents {
      min-width: ${EVENT_DETAILS_MOBILE_MIN_WIDTH}px;
      max-width: ${EVENT_DETAILS_MOBILE_MAX_WIDTH}px;
      margin: 0 auto;
    }
  }

  .EventPage-RelatedEvents {
    margin-top: ${getSpacing("m")}px;
  }
`;

const EventDetails = ({
  event,
  place,
  desktop,
  media,
  onSubmitContribution
}) => (
  <div className={`EventPage`}>
    {media === DESKTOP && (
      <EventDetailsDesktop
        data={event}
        onClickOrgaLink={handleClickOrgaLink}
        onSubmitContribution={onSubmitContribution}
      />
    )}

    {media === MOBILE && (
      <EventDetailsMobile
        data={event}
        onClickOrgaLink={handleClickOrgaLink}
        onSubmitContribution={onSubmitContribution}
      />
    )}

    {media && (
      <section className={`EventPage-RelatedEvents`}>
        <RelatedEvents event={event} place={place} desktop={desktop} />
      </section>
    )}

    <style jsx>{style}</style>
  </div>
);

export default EventDetails;
