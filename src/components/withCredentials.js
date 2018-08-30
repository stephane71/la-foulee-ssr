import asyncGetCredentials from '../utils/asyncGetCredentials';

const withCredentials = WrappedComponent => {
  return class credentialsWrapper extends React.Component {
    constructor(...args) {
      super(...args);

      this.needsRefresh = this.needsRefresh.bind(this);
      this.getCredentials = this.getCredentials.bind(this);

      this.credentials = null;
      this.fetching = null;
    }

    static displayName = `withCredentials(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
    }

    componentDidMount() {
      // Needed to fetch credentials when the api is not call
      // Ex: all pages that do not required an api call ! Event details / Home
      this.getCredentials();
    }

    render() {
      return (
        <WrappedComponent
          credentialsNeedsRefresh={this.needsRefresh}
          getCredentials={this.getCredentials}
          {...this.props}
        />
      );
    }

    needsRefresh() {
      return !this.credentials || this.credentials.needsRefresh();
    }

    async getCredentialsSongleton(clearCache) {
      let credentials;

      if (!this.needsRefresh()) return this.credentials;

      try {
        credentials = await asyncGetCredentials(clearCache);
        this.credentials = credentials;
      } catch (e) {
        console.log('-withCredentials:getCredentials:', e.statusCode);
        console.log(e.code, e.message);
        console.log('--- Stack ---');
        console.log(e);
        if (e.statusCode === 400 && !clearCache) {
          console.log(
            '-withCredentials:getCredentials: clear cache id & try again'
          );
          // Warning!: becarefull of the recursive loop with the condition on 'clearCache'
          return this.getCredentialsSongleton(true);
        }
      }
      return credentials;
    }

    async getCredentials(clearCache) {
      if (!this.fetching)
        this.fetching = this.getCredentialsSongleton(clearCache);

      let credentials = await this.fetching;
      this.fetching = null;

      return credentials;
    }
  };
};

export default withCredentials;
