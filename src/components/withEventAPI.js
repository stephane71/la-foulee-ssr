import apigClientFactory from "aws-api-gateway-client";
import getConfig from "next/config";

import {
  getAroundEventListArgs,
  postNewsletterEmailArgs,
  postEventContributionArgs
} from "../api";

const { publicRuntimeConfig } = getConfig();
const {
  EVENT_API_URL,
  EVENT_CONTRIBUTION_API_URL,
  NEWSLETTER_API_URL,
  AWS_API_REGION
} = publicRuntimeConfig;

const EVENT_API = "event";
const EVENT_CONTRIBUTION_API = "eventContribution";
const NEWSLETTER_API = "newsletter";
const API_NAME_TO_URL = {
  [EVENT_API]: EVENT_API_URL,
  [EVENT_CONTRIBUTION_API]: EVENT_CONTRIBUTION_API_URL,
  [NEWSLETTER_API]: NEWSLETTER_API_URL
};

function getAPIGatewayClient(name, credentials) {
  return apigClientFactory.newClient({
    invokeUrl: API_NAME_TO_URL[name],
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
      let api = await this.getAPI(EVENT_API);
      const args = getAroundEventListArgs(geohash);
      return await api.invokeApi(...args).then(res => res.data);
    }

    async postNewsletterEmail(email) {
      let api = await this.getAPI(NEWSLETTER_API);
      const args = postNewsletterEmailArgs(email);
      return await api.invokeApi(...args).then(res => res.data);
    }

    async postEventContribution({ contribution, user }, event) {
      let api = await this.getAPI(EVENT_CONTRIBUTION_API);
      const args = postEventContributionArgs({ contribution, user }, event);
      return await api.invokeApi(...args).then(res => res.data);
    }
  };
};

export default withEventAPI;
