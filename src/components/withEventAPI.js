import apigClientFactory from 'aws-api-gateway-client';
import getConfig from 'next/config';

import { getEventArgs, getEventListArgs, getAroundEventListArgs } from '../api';
import { getFormatEventList } from '../utils/apiProxy';

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
      this.getAroundEventList = this.getAroundEventList.bind(this);
    }

    render() {
      return (
        <WrappedComponent
          getEvent={this.getEvent}
          getEventList={this.getEventList}
          getAroundEventList={this.getAroundEventList}
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

    async getAroundEventList(selectors, currentPage) {
      let api = await this.getAPI();
      const args = getAroundEventListArgs(selectors.location, currentPage);
      return await api.invokeApi(...args).then(res => res.data);
    }
  };
};

export default withEventAPI;
