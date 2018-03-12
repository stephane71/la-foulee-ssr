import dynamic from 'next/dynamic';
import withRedux from 'next-redux-wrapper';
import UrlPattern from 'url-pattern';
import { compose } from 'redux';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';
import SplashScreen from '../components/SplashScreen';
import Loader from '../components/Loader';
import Layout from '../components/Layout';

import { makeStore } from '../store';
import { setSelectedEvent } from '../actions';

const MIN_LOAD_TIME = 2000;
const eventPattern = new UrlPattern('/event/:keyword(/)');
const searchPattern = new UrlPattern('/search(/)');

class Route extends React.PureComponent {
  rendered = false;

  render() {
    if (this.rendered || this.props.test) {
      this.rendered = true;
      return (
        <div
          className={`Route prevent-scroll  ${
            this.props.test ? '' : 'wrapper-hidden'
          }`}
        >
          {this.props.children}
        </div>
      );
    }
    return null;
  }
}

const EventPageContainer = dynamic(import('../containers/EventPageContainer'), {
  ssr: false,
  loading: () => <Loader />
});

const EventListContainer = dynamic(import('../containers/EventListContainer'), {
  ssr: false,
  loading: () => <Loader />
});

class Index extends React.PureComponent {
  state = {
    minLoading: true
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ minLoading: false });
    }, MIN_LOAD_TIME);
  }

  render() {
    let eventMatch = eventPattern.match(this.props.url.asPath);
    return (
      <Layout>
        {(this.state.minLoading || !this.props.eventListReady) && (
          <SplashScreen />
        )}

        <Route test={eventMatch}>
          <EventPageContainer
            {...this.props}
            keyword={eventMatch && eventMatch.keyword}
          />
        </Route>

        <Route test={searchPattern.match(this.props.url.asPath)}>
          <EventListContainer {...this.props} />
        </Route>
      </Layout>
    );
  }
}

Index.getInitialProps = function({ store, isServer, ...context }) {
  return {};
};

function mapStateToProps(state) {
  return {
    eventListReady: state.eventListReady
  };
}

export default compose(
  withRedux(makeStore, mapStateToProps),
  withCredentials,
  withEventAPI
)(Index);
