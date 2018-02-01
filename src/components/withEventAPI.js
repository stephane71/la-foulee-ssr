import apigClientFactory from 'aws-api-gateway-client';

import { getEventArgs, getEventListArgs } from '../api';

function getAPIGatewayClient(credentials) {
  return apigClientFactory.newClient({
    invokeUrl: process.env.API_URL,
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
          {...this.props}
        />
      );
    }

    api = null;

    async getAPI() {
      if (this.props.credentialsNeedsRefresh()) {
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

    async getEventList(selectors) {
      let api = await this.getAPI();
      const args = getEventListArgs(selectors);
      return await api.invokeApi(...args).then(res => res.data);
    }
  };
};

export default withEventAPI;
