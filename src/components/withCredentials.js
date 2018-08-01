import asyncGetCredentials from '../utils/asyncGetCredentials';

const withCredentials = WrappedComponent => {
  return class credentialsWrapper extends React.Component {
    constructor(...args) {
      super(...args);

      this.needsRefresh = this.needsRefresh.bind(this);
      this.getCredentials = this.getCredentials.bind(this);

      this.credentials = null;
    }

    static displayName = `withCredentials(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
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

    async getCredentials(clearCache) {
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
          return this.getCredentials(true);
        }
      }
      return credentials;
    }
  };
};

export default withCredentials;
