import axios from 'axios';
import Geohash from 'latlon-geohash';
import apigClientFactory from 'aws-api-gateway-client';
import getConfig from 'next/config';

import { getEventArgs, getEventListArgs } from '../api';
import { getFormatEventList } from '../utils/apiProxy';

const GOOGLE_GEOLOC_URL = 'https://www.googleapis.com/geolocation/v1/geolocate';
const GOOGLE_GEOLOC_API_KEY = process.env.GOOGLE_GEOLOC_API_KEY;
const GEOHASH_PRECISION = 4;

const { publicRuntimeConfig } = getConfig();

function getAPIGatewayClient(credentials) {
  return apigClientFactory.newClient({
    invokeUrl: publicRuntimeConfig.API_URL,
    region: 'eu-west-1',
    accessKey: credentials.accessKeyId,
    secretKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken
  });
}

const withEventAPI = WrappedComponent => {
  return class eventAPIWrapper extends React.Component {
    static displayName = `withEventAPI(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
    }

    constructor(...args) {
      super(...args);

      this.getAPI = this.getAPI.bind(this);
      this.getEvent = this.getEvent.bind(this);
      this.getEventList = this.getEventList.bind(this);
    }

    render() {
      return (
        <WrappedComponent
          getEvent={this.getEvent}
          getEventList={this.getEventList}
          getUserGeolocation={this.getUserGeolocation}
          {...this.props}
        />
      );
    }

    api = null;

    async getAPI() {
      if (!this.api || this.props.credentialsNeedsRefresh()) {
        let credentials = await this.props.getCredentials();
        this.api = getAPIGatewayClient(credentials);
      }

      return this.api;
    }

    async getEvent(strideID) {
      let api = await this.getAPI();
      const args = getEventArgs(strideID);
      return await api.invokeApi(...args).then(res => res.data);
    }

    async getEventList(selectors, currentPage) {
      let api = await this.getAPI();
      const args = getEventListArgs(selectors, currentPage);
      return await api
        .invokeApi(...args)
        .then(res => getFormatEventList(res.data));
    }

    async getUserGeolocation() {
      const req = `${GOOGLE_GEOLOC_URL}?key=${GOOGLE_GEOLOC_API_KEY}`;
      let res;
      try {
        res = await axios.post(req);
      } catch (e) {
        console.log('Problem when try to fetch the user position');
        console.log(e);
        return null;
      }
      const { lat, lng } = res.data.location;
      return Geohash.encode(lat, lng, GEOHASH_PRECISION);
    }
  };
};

export default withEventAPI;
