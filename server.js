console.log("----------------------------------");
console.log("----- Running NextJS server ------");
console.log("----------------------------------");

console.log("NODE_ENV", process.env.NODE_ENV);

const env =
  process.env.LA_FOULEE_ENV === "local" ? "dev" : process.env.LA_FOULEE_ENV;
require("dotenv").config({ path: `.env.server.${env}` });

const express = require("express");
const next = require("next");
const moment = require("moment");

const getSitemap = require("./internals/getSitemap");
const getPlace = require("./src/server/getPlace");
const {
  getEventListDepartment,
  getEventListAround
} = require("./src/server/getEvents");
const getGeohash = require("./src/server/getGeohash");
const getEvent = require("./src/server/getEvent");
const getDepartmentCode = require("./src/server/getDepartmentCode");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const dir = "./src";

const app = next({ dev, dir });
const handle = app.getRequestHandler();
const server = express();

const now = () =>
  console.log(
    moment()
      .utc()
      .format("YYYY-MM-DD HH:mm:ss")
  );

server.use(function(req, res, next) {
  if (req.path.substr(-1) == "/" && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

server.get("/sw.js", (req, res) => {
  var options = {
    root: __dirname + "/src/static/",
    dotfiles: "deny"
  };
  res.sendFile("sw.js", options);
});

server.get("/robots.txt", (req, res) => {
  var options = {
    root: __dirname + "/src/static/",
    dotfiles: "deny"
  };
  res.sendFile("robots.txt", options);
});

// TODO: update new sitemap files name
server.get("/sitemap/:sitemap", async (req, res) => {
  // FIXME: S3 access when build on prod env
  // const sitemap = await getSitemap();
  // res.set('Content-Type', 'text/plain; charset=UTF-8');
  // res.status(200).send(sitemap);

  //Idea: update the sitemap any time an item has been added in DynamoDB table
  // Use DynaoDB Stream + Lambda

  var options = {
    root: __dirname + "/src/static/",
    dotfiles: "deny"
  };
  res.sendFile(req.params.sitemap, options);
});

const eventHandler = async function(req, res) {
  const NO_EVENT_SELECTED = null;

  let event = NO_EVENT_SELECTED;
  const { keyword, edition } = req.params;
  try {
    if (keyword)
      event = (await getEvent(keyword, edition)) || NO_EVENT_SELECTED;
    if (!event) {
      now();
      console.log(
        `[La Foulee] - Error - Client: '/event/${keyword}' | Unkown event`
      );
      res.statusCode = 404;
    }
  } catch (e) {
    now();
    console.log(
      `[La Foulee] - Error - Server:'/event/${keyword}' | Error when try to fetch event`
    );
    res.statusCode = 500;
  }

  const query = { ...req.params, ...req.query };
  app.render(req, res, "/event", { ...query, event });
};

server.get("/event/:keyword/:edition", eventHandler);
server.get("/event/:keyword", eventHandler);

const eventListHandler = async function(req, res) {
  const { department, city } = req.params;
  let events = [];
  let place = null;
  let position = null;
  let depCode = null;

  now();
  console.log(
    "[La Foulee] - req for event list: department = ",
    department,
    " city = ",
    city
  );

  depCode = getDepartmentCode(department);

  if (!department || !depCode) {
    res.statusCode = 404;
  } else {
    try {
      place = await getPlace({ department, city });
      if (city) position = getGeohash(place);

      events = city
        ? await getEventListAround(position)
        : await getEventListDepartment(depCode);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        console.log(
          `[La Foulee] - Error - Client: Unknown department (from La Foulee Places API)`
        );
        res.statusCode = 404;
      } else {
        console.log(
          `[La Foulee] - Error - Server | Error when try to fetch events`
        );
        res.statusCode = 500;
      }
      console.log(e);
    }
  }

  app.render(req, res, "/events", {
    ...req.query,
    depCode,
    position,
    place,
    events
  });
};

server.get("/events/:department", eventListHandler);
server.get("/events/:department/:city", eventListHandler);

server.get("*", (req, res) => {
  // FIXME: doesn't serve pre-render pages
  return handle(req, res);
});

app
  .prepare()
  .then(() => {
    server.listen(port, err => {
      if (err) {
        now();
        console.log(`Error when try to run NextJS server`);
        console.log(JSON.stringify(err));
        throw err;
        return;
      }
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
