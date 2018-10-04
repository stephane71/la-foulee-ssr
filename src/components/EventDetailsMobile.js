import css from "styled-jsx/css";

import EventDetailsGlobalInfo from "./EventDetailsGlobalInfo";
import EventDetailsShare from "./EventDetailsShare";
import EventDetailsActivities from "./EventDetailsActivities";
import EventDetailsOrgaLink from "./EventDetailsOrgaLink";
import StaticMap from "./StaticMap";

import { getSpacing, getFontSize } from "../styles-variables";
import { white, getColor } from "../colors";

const ICON_COLOR = getColor("light");
const MAP_MOBILE_HEIGHT = 100;
const MOBILE_MIN_WIDTH = 320;
const MOBILE_MAX_WIDTH = 450;

const style = css`
  .EventDetails {
    position: relative;
    width: 100%;
    height: 100%;
    padding: ${getSpacing("m")}px;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;

    min-width: ${MOBILE_MIN_WIDTH}px;
    max-width: ${MOBILE_MAX_WIDTH}px;
    margin: 0 auto;
    background-color: ${white};
  }

  .EventDetails > div {
    margin-bottom: ${getSpacing("m")}px;
  }

  .EventDetails > section {
    margin-bottom: ${getSpacing("m")}px;
  }

  .EventDetails-Header {
    margin-bottom: ${getSpacing("m")}px;
  }

  .EventDetails-Title {
    text-transform: capitalize;
    font-family: "Circular-Medium";
    font-weight: 500;
    margin: 0;
  }

  .EventDetails-Subtitle {
    font-size: ${getFontSize("l")}px;
    margin: 0;
  }

  .EventDetails-StaticMap {
    height: ${MAP_MOBILE_HEIGHT}px;
  }

  .EventDetails-Footer {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: ${getSpacing("m")}px 0;
  }
`;

const EventDetailsMobile = ({ data, desktop, isServer, onClickOrgaLink }) => (
  <article className={"EventDetails"}>
    <header className={`EventDetails-Header`}>
      <h1 className={`EventDetails-Title`}>{data.title}</h1>
    </header>

    <div className={"EventDetails-GlobalInfo"}>
      <EventDetailsGlobalInfo
        data={data}
        desktop={desktop}
        isServer={isServer}
        iconColor={ICON_COLOR}
      />
    </div>

    <div className={"EventDetails-StaticMap"}>
      <StaticMap
        event={data}
        desktop={desktop}
        color={ICON_COLOR}
        isServer={isServer}
        dimensions={{ height: MAP_MOBILE_HEIGHT }}
      />
    </div>

    <section className={"EventDetails-ShareEvent"}>
      <EventDetailsShare
        data={data}
        desktop={desktop}
        isServer={isServer}
        iconColor={ICON_COLOR}
      />
    </section>

    <section className={"EventDetails-Activities"}>
      <h2 className={"EventDetails-Subtitle"}>{"Épreuves"}</h2>
      {data.activities && data.activities.length ? (
        <EventDetailsActivities data={data} />
      ) : (
        <div>{`Aucune épreuve n'a été transmise par l'organisateur`}</div>
      )}
    </section>

    <footer className={"EventDetails-Footer"}>
      <EventDetailsOrgaLink
        data={data}
        desktop={desktop}
        onClickOrgaLink={onClickOrgaLink}
      />
    </footer>

    <style jsx>{style}</style>
  </article>
);

export default EventDetailsMobile;
