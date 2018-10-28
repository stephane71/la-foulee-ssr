import getConfig from "next/config";
import Head from "next/head";
import moment from "moment";

import getEventDescription from "../utils/getEventDescription";

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;

const EventMetaHeader = ({ event, path, query }) => {
  const { edition } = query;

  const canonical = `${APP_URL}${path}${edition ? "" : `/${moment().year()}`}`;
  const description = getEventDescription(event);
  const imageTwitter = `${ASSETS_URL}/android-chrome-512x512.png`;
  const imageFB = `${ASSETS_URL}/glyph.dominant.144x144%402x.png`;

  return (
    <Head>
      <title>{`La Foulée | ${event.title}`}</title>
      <link rel={"canonical"} href={canonical} />
      <meta name={"description"} content={description} />

      {/* TWITTER */}
      <meta name={"twitter:card"} content={"summary"} />
      <meta name={"twitter:site"} content={"@_LaFoulee"} />
      <meta name={"twitter:title"} content={event.title} />
      <meta name={"twitter:description"} content={description} />
      <meta name={"twitter:image"} content={imageTwitter} />

      {/* OPEN GRAPH */}
      <meta property={"og:url"} content={`${APP_URL}${path}`} />
      <meta property={"og:title"} content={event.title} />
      <meta property={"og:description"} content={description} />
      <meta property={"og:image"} content={imageFB} />
    </Head>
  );
};

export default EventMetaHeader;
