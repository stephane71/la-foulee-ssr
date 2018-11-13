import apigClientFactory from "aws-api-gateway-client";
import getConfig from "next/config";
import slug from "slug";

import {
  getEventArgs,
  getEventListArgs,
  postNewsletterEmailArgs,
  postEventContributionArgs,
  API_EVENT_LIST_AROUND,
  API_EVENT_LIST_DEPARTMENT,
  API_EVENT_LIST_PLACE
} from "../api";

const { publicRuntimeConfig } = getConfig();
const {
  AWS_API_REGION,
  BASE_API_URL,
  EVENT_API_PATH,
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

      this.getPlace = this.getPlace.bind(this);
      this.getEvent = this.getEvent.bind(this);
      this.getEventList = this.getEventList.bind(this);
      this.getEventListDepartment = this.getEventListDepartment.bind(this);
      this.getEventListAround = this.getEventListAround.bind(this);
      this.postNewsletterEmail = this.postNewsletterEmail.bind(this);
      this.postEventContribution = this.postEventContribution.bind(this);
    }

    render() {
      return (
        <WrappedComponent
          getPlace={this.getPlace}
          getEvent={this.getEvent}
          getEventList={this.getEventList}
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

    async invoke(apiName, params) {
      let api = await this.getAPI(apiName);
      let args = {};

      switch (apiName) {
        case EVENT_API_PATH:
          args = getEventArgs(params);
          break;
        case EVENTS_API_PATH:
          const { type, ...restParams } = params;
          args = getEventListArgs(type, restParams);
          break;
        case NEWSLETTER_API_PATH:
          args = postNewsletterEmailArgs(params);
          break;
        case EVENT_CONTRIBUTION_API_PATH:
          args = postEventContributionArgs(params);
          break;
      }

      return api.invokeApi(...args).then(res => res.data);
    }

    getEvent({ keyword, edition }) {
      return this.invoke(EVENT_API_PATH, {
        keyword,
        edition
      });
    }

    // TODO: use slug in event instead of city & department
    getPlace({ placeSlug } = {}) {
      const placeSlugSplit = placeSlug.split("_");

      return this.invoke(EVENTS_API_PATH, {
        type: API_EVENT_LIST_PLACE,
        department: placeSlugSplit[0],
        city: placeSlugSplit[1]
      });
    }

    getEventList(type, value) {
      if (type === API_EVENT_LIST_DEPARTMENT) {
        return this.getEventListDepartment(value);
      }
      if (type === API_EVENT_LIST_AROUND) {
        return this.getEventListAround(value);
      }
    }

    getEventListDepartment(department) {
      return this.invoke(EVENTS_API_PATH, {
        type: API_EVENT_LIST_DEPARTMENT,
        code: department
      });
    }

    getEventListAround(geohash) {
      return this.invoke(EVENTS_API_PATH, {
        type: API_EVENT_LIST_AROUND,
        geohash
      });
    }

    postNewsletterEmail(email) {
      return this.invoke(NEWSLETTER_API_PATH, email);
    }

    postEventContribution({ contribution, user }, event) {
      return this.invoke(EVENT_CONTRIBUTION_API_PATH, {
        contribution,
        user,
        event
      });
    }
  };
};

export default withEventAPI;
