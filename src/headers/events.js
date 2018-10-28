import getConfig from "next/config";
import Head from "next/head";
import moment from "moment";

import { SelectedPlaceContext } from "../components/Layout";

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;

function getEventListDescription(events, place, query = {}) {
  let location = query.depCode ? "dans le département " : "autour de ";
  location += place ? place.name : "";

  return `Retrouvez les ${
    events.length
  } evénements de courses à pieds ${location} ${
    events.length
      ? `à partir du ${moment
          .unix(events[0].date)
          .utc()
          .format("dddd DD/MM/YYYY")}`
      : ""
  }`;
}

function getHeadData(events, place, query) {
  let title = "Tous les evénements de courses à pieds ";
  if (query.depCode) title += `dans le département`;
  else if (place) title += `autour de`;

  return {
    imageTwitter: `${ASSETS_URL}/android-chrome-512x512.png`,
    imageFB: `${ASSETS_URL}/glyph.dominant.144x144%402x.png`,
    description: getEventListDescription(events, place, query),
    title: `${title} ${place ? place.name : ""}`
  };
}

const EventListMetaHeaders = ({ events, place, path, query }) => {
  const { imageTwitter, imageFB, title, description } = getHeadData(
    events,
    place,
    query
  );

  // WARNING: next-head needs to be the direct parent to inject the class "next-head"
  // This class is using internaly by NextJS
  // Problem happened with <title> when use <Head> to wrapp this component in events page
  // <title> was errase in client side
  return (
    <Head>
      <title>{`La Foulée | ${title}`}</title>
      <link rel={"canonical"} href={`${APP_URL}${path}`} />
      <meta name={"description"} content={description} />
      {/* TWITTER */}
      <meta name={"twitter:card"} content={"summary"} />
      <meta name={"twitter:site"} content={"@_LaFoulee"} />
      <meta name={"twitter:title"} content={title} />
      <meta name={"twitter:description"} content={description} />
      <meta name={"twitter:image"} content={imageTwitter} />
      {/* OPEN GRAPH */}
      <meta property={"og:url"} content={`${APP_URL}${path}`} />
      <meta property={"og:title"} content={title} />
      <meta property={"og:description"} content={description} />
      <meta property={"og:image"} content={imageFB} />
    </Head>
  );
};

export default props => (
  <SelectedPlaceContext.Consumer>
    {placeContext => (
      <EventListMetaHeaders {...props} place={placeContext || props.place} />
    )}
  </SelectedPlaceContext.Consumer>
);
