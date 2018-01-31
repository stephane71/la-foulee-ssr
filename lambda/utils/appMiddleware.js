const next = require('next');
const getStrideList = require('../api/getStrideList');
const getStride = require('../api/getStride');
const apigClientFactory = require('./getAPIGatewayClient');

const apigClient = apigClientFactory();

module.exports = function(app) {
  return async function(req, res) {
    if (req.query.event) {
      try {
        let data = await getStride(apigClient, req.query.event);
        app.render(req, res, '/app', { event: data });
      } catch (e) {
        console.log('Something bad happened here :(');
        res.status(404).send('Event Not Found');
      }
    } else {
      const selectors = {
        month: '0-2018',
        dep: '',
        page: 0
      };

      try {
        let data = await getStrideList(apigClient, selectors);
        app.render(req, res, '/app', { eventList: data });
      } catch (e) {
        console.log('Something bad happened here :(');
        res.status(404).send('Selectors are not correct');
      }
    }
  };
};
