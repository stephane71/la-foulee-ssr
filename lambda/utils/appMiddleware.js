const next = require('next');
const moment = require('moment');

const getStrideList = require('../api/getStrideList');
const getStride = require('../api/getStride');
const apigClientFactory = require('./getAPIGatewayClient');

const apigClient = apigClientFactory();

const CURRENT_MONTH = `${moment().month()}-${moment().year()}`;

module.exports = function(app) {
  return function(req, res) {
    if (req.query.event) {
      getStride(apigClient, req.query.event)
        .then(data => app.render(req, res, '/app', { event: data }))
        .catch(e => {
          console.log('Something bad happened here :(');
          res.status(404).send('Event Not Found');
        });
    } else {
      const selectors = {
        month: CURRENT_MONTH,
        dep: '',
        page: 0
      };

      getStrideList(apigClient, selectors)
        .then(data => app.render(req, res, '/app', { eventList: data }))
        .catch(e => {
          console.log('Something bad happened here :(');
          res.status(404).send('Selectors are not correct');
        });
    }
  };
};
