import apigClientFactory from "aws-api-gateway-client";
import getConfig from "next/config";

import {
  getAroundEventListArgs,
  postNewsletterEmailArgs,
  postEventContributionArgs
} from "../api";

const { publicRuntimeConfig } = getConfig();
const {
  AWS_API_REGION,
  BASE_API_URL,
  EVENTS_API_PATH,
  NEWSLETTER_API_PATH,
  EVENT_CONTRIBUTION_API_PATH
} = publicRuntimeConfig;

function getAPIGatewayClient(name, credentials) {
  return apigClientFactory.newClient({
    invokeUrl: `${BASE_API_URL}/${name}`,
    region: AWS_API_REGION,
    accessKey: credentials.accessKeyId,
    secretKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken
  });
}

const withEventAPI = WrappedComponent => {
  return class eventAPIWrapper extends React.Component {
    static displayName = `withEventAPI(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component"})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
    }

    constructor(...args) {
      super(...args);

      this.getEventListAround = this.getEventListAround.bind(this);
      this.postNewsletterEmail = this.postNewsletterEmail.bind(this);
      this.postEventContribution = this.postEventContribution.bind(this);
    }

    render() {
      return (
        <WrappedComponent
          getEventListAround={this.getEventListAround}
          postNewsletterEmail={this.postNewsletterEmail}
          postEventContribution={this.postEventContribution}
          {...this.props}
        />
      );
    }

    api = {};

    async getAPI(name) {
      let api = this.api[name];
      if (!api || this.props.credentialsNeedsRefresh()) {
        let credentials = await this.props.getCredentials();
        this.api[name] = getAPIGatewayClient(name, credentials);
      }

      return this.api[name];
    }

    async getEventListAround(geohash) {
      let api = await this.getAPI(EVENTS_API_PATH);
      const args = getAroundEventListArgs(geohash);
      return await api.invokeApi(...args).then(res => res.data);
    }

    async postNewsletterEmail(email) {
      let api = await this.getAPI(NEWSLETTER_API_PATH);
      const args = postNewsletterEmailArgs(email);
      return await api.invokeApi(...args).then(res => res.data);
    }

    async postEventContribution({ contribution, user }, event) {
      let api = await this.getAPI(EVENT_CONTRIBUTION_API_PATH);
      const args = postEventContributionArgs({ contribution, user }, event);
      return await api.invokeApi(...args).then(res => res.data);
    }
  };
};

export default withEventAPI;
