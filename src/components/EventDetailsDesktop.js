import css from "styled-jsx/css";

import EventDetailsGlobalInfo from "./EventDetailsGlobalInfo";
import EventDetailsShare from "./EventDetailsShare";
import EventDetailsActivities from "./EventDetailsActivities";
import EventDetailsOrgaLink from "./EventDetailsOrgaLink";
import StaticMap from "./StaticMap";
import EventDetailsContribution from "./EventDetailsContribution";

import { getSpacing, getFontSize } from "../styles-variables";
import { white, getColor, TABLE_BORDER_COLOR } from "../colors";
import { BORDER_RADIUS } from "../enums";

const ICON_COLOR = getColor("light");
const MAP_DESKTOP_WIDTH = 300;
const MAP_DESKTOP_HEIGHT = 350;

const eventDetailsLayout = css`
  .EventDetailsDesktop {
    display: flex;
    flex-direction: column;
    padding: ${getSpacing("m")}px;
    background-color: ${white};
    border-radius: ${BORDER_RADIUS}px;
  }

  .EventDetailsDesktop-Main {
    display: flex;
    justify-content: space-between;
  }

  .EventDetailsDesktop-UserContrib {
    margin-top: ${getSpacing("l")}px;
  }

  .EventDetailsDesktop-Left {
    width: 50%;
  }

  .EventDetailsDesktop-Left > div {
    margin-top: ${getSpacing("m")}px;
  }

  .EventDetailsDesktop-Left > section {
    margin-top: ${getSpacing("m")}px;
  }

  .EventDetailsDesktop-Right {
    width: ${MAP_DESKTOP_WIDTH}px;
    display: flex;
    flex-direction: column;
  }

  .EventDetailsDesktop-Right > div {
    margin-bottom: ${getSpacing("m")}px;
  }
`;

const style = css`
  .EventDetailsDesktop-Share {
    border-top: 1px solid ${TABLE_BORDER_COLOR};
    border-bottom: 1px solid ${TABLE_BORDER_COLOR};
  }

  .EventDetailsDesktop-Activities {
    padding-top: ${getSpacing("m")}px;
  }

  .EventDetailsDesktop-StaticMap {
    width: ${MAP_DESKTOP_WIDTH}px;
    height: ${MAP_DESKTOP_HEIGHT}px;
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
`;

const EventDetailsDesktop = ({
  data,
  desktop,
  isServer,
  onClickOrgaLink,
  onSubmitContribution
}) => (
  <article className={"EventDetailsDesktop"}>
    <div className={"EventDetailsDesktop-Main"}>
      <div className={"EventDetailsDesktop-Left"}>
        <header className={`EventDetails-Header`}>
          <h1 className={`EventDetails-Title`}>{data.title}</h1>
        </header>

        <div className={"EventDetailsDesktop-GlobalInfo"}>
          <EventDetailsGlobalInfo
            data={data}
            desktop={desktop}
            isServer={isServer}
            iconColor={ICON_COLOR}
            withMap={false}
          />
        </div>

        <section className={"EventDetailsDesktop-Share"}>
          <EventDetailsShare
            data={data}
            desktop={desktop}
            isServer={isServer}
            iconColor={ICON_COLOR}
          />
        </section>

        <section className={"EventDetailsDesktop-Activities"}>
          <h2 className={"EventDetails-Subtitle"}>{"Épreuves"}</h2>
          {data.activities && data.activities.length ? (
            <EventDetailsActivities data={data} />
          ) : (
            <div>{`Aucune épreuve n'a été transmise par l'organisateur`}</div>
          )}
        </section>
      </div>

      <div className={"EventDetailsDesktop-Right"}>
        <div className={"EventDetailsDesktop-StaticMap"}>
          <StaticMap
            event={data}
            desktop={desktop}
            color={ICON_COLOR}
            isServer={isServer}
            dimensions={{
              width: MAP_DESKTOP_WIDTH,
              height: MAP_DESKTOP_HEIGHT
            }}
          />
        </div>

        <footer>
          <EventDetailsOrgaLink
            data={data}
            desktop={desktop}
            onClickOrgaLink={onClickOrgaLink}
          />
        </footer>
      </div>
    </div>

    <section className={"EventDetailsDesktop-UserContrib"}>
      <EventDetailsContribution
        event={data}
        iconColor={ICON_COLOR}
        onSubmitContribution={onSubmitContribution}
      />
    </section>

    <style jsx>{eventDetailsLayout}</style>
    <style jsx>{style}</style>
  </article>
);

export default EventDetailsDesktop;
