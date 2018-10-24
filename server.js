console.log("----------------------------------");
console.log("----- Running NextJS server ------");
console.log("----------------------------------");

console.log("NODE_ENV", process.env.NODE_ENV);

const env =
  process.env.LA_FOULEE_ENV === "local" ? "dev" : process.env.LA_FOULEE_ENV;
require("dotenv").config({ path: `.env.server.${env}` });

const express = require("express");
const next = require("next");

const getSitemap = require("./internals/getSitemap");
const getPlace = require("./src/server/getPlace");
const {
  getEventListDepartment,
  getEventListAround
} = require("./src/server/getEvents");
const getGeohash = require("./src/server/getGeohash");
const getEvent = require("./src/server/getEvent");
const DEPARTMENTS = require("./src/server/departments");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const dir = "./src";

const app = next({ dev, dir });
const handle = app.getRequestHandler();
const server = express();

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
      console.log(
        `[La Foulee] - Error - Client: '/event/${keyword}' | Unkown event`
      );
      res.statusCode = 404;
    }
  } catch (e) {
    console.log(
      `[La Foulée] - Error - Server:'/event/${keyword}' | Error when try to fetch event`
    );
    res.statusCode = 500;
  }

  app.render(req, res, "/event", { ...req.query, event });
};

server.get("/event/:keyword/:edition", eventHandler);
server.get("/event/:keyword", eventHandler);

server.get("/events/department/:code", async (req, res) => {
  const code = parseInt(req.params.code);
  let events = [];
  let place = null;

  try {
    const department = DEPARTMENTS.find(dep => parseInt(dep.code) === code);
    if (!code || !department) {
      console.log(
        `[La Foulée] - Error - Client:'/events/department/${code}' | Unknown department`
      );
      res.statusCode = 404;
    }
    place = await getPlace("regions", department.name);
    events = await getEventListDepartment(code);
  } catch (e) {
    if (e.response && e.response.status === 404) {
      console.log(
        `[La Foulée] - Error - Client:'/events/department/${code}' | Unknown department`
      );
      res.statusCode = 404;
    } else {
      console.log(
        `[La Foulée] - Error - Server:'/events/department/${code}' | Error when try to fetch events from department`
      );
      console.log(e);
      res.statusCode = 500;
    }
  }

  app.render(req, res, "/events", {
    ...req.query,
    events,
    place,
    depCode: code,
    position: null
  });
});

server.get("/events/:city", async (req, res) => {
  let position = null;
  let events = [];
  let place = null;

  try {
    place = await getPlace("cities", req.params.city);
    if (!place) res.statusCode = 404;
    else {
      position = getGeohash(place);
      events = await getEventListAround(position);
    }
  } catch (e) {
    console.log(
      `[La Foulée] - Error - Server:'/events/${
        req.params.city
      }' | Error when try to fetch city or events`
    );
    console.log(e);
    res.statusCode = 500;
  }

  app.render(req, res, "/events", {
    ...req.query,
    events,
    place,
    position
  });
});

server.get("*", (req, res) => {
  // FIXME: doesn't serve pre-render pages
  return handle(req, res);
});

app
  .prepare()
  .then(() => {
    server.listen(port, err => {
      if (err) {
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
