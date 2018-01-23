import apigClientFactory from 'aws-api-gateway-client';

import asyncGetCredentials from '../utils/asyncGetCredentials';

function getAPIGatewayClient(credentials) {
  return apigClientFactory.newClient({
    invokeUrl: process.env.API_URL,
    region: 'eu-west-1',
    accessKey: credentials.accessKeyId,
    secretKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken
  });
}

async function getEventArgs(strideID) {
  const params = {
    strideID
  };
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/stride/{strideID}';
  const method = 'GET';
  const additionalParams = {};
  const body = {};

  return [params, pathTemplate, method, additionalParams, body];
}

const withEventAPI = WrappedComponent => {
  return class eventAPIWrapper extends React.Component {
    static displayName = `withEventAPI(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
    }

    componentDidMount() {
      // This hook is only call on client side
      this.api = this.getAPI();
    }

    render() {
      return (
        <WrappedComponent api={this.getEventApi(this.api)} {...this.props} />
      );
    }

    api = null;

    async getAPI() {
      if (this.props.credentialsNeedsRefresh()) {
        let credentials = await this.props.getCredentials();
        this.api = getAPIGatewayClient(credentials);
      }

      return Promise.resolve(this.api);
    }

    getEventApi() {
      return {
        async getEvent(strideID) {
          // const args = getEventArgs(strideID);
          // let api = await this.getAPI();
          // return await api.invokeApi(...args);
        }
      };
    }
  };
};

export default withEventAPI;
