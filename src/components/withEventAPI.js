import apigClientFactory from 'aws-api-gateway-client';
import getConfig from 'next/config';

import { getEventArgs, getAroundEventListArgs } from '../api';

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
      this.getEventListAround = this.getEventListAround.bind(this);
    }

    render() {
      return (
        <WrappedComponent
          getEvent={this.getEvent}
          getEventListAround={this.getEventListAround}
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

    async getEventListAround(position) {
      let api = await this.getAPI();
      const args = getAroundEventListArgs(position);
      return await api.invokeApi(...args).then(res => res.data);
    }
  };
};

export default withEventAPI;
