import dynamic from 'next/dynamic';
import withRedux from 'next-redux-wrapper';
import UrlPattern from 'url-pattern';
import { compose } from 'redux';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';
import SplashScreen from '../components/SplashScreen';
import Loader from '../components/Loader';
import Layout from '../components/Layout';

import AboutPage from '../components/AboutPage';
import ContactPage from '../components/ContactPage';

import { MAX_WIDTH, DESKTOP, MOBILE } from '../enums';
import { setEventListReadyFlag, setMediaType } from '../actions';
import { makeStore } from '../store';

const MIN_LOAD_TIME = 2000;

const homePattern = new UrlPattern('(/)');
const eventPattern = new UrlPattern('/event/:keyword(/)');
const searchPattern = new UrlPattern('/search(/)');
const aboutPattern = new UrlPattern('/about(/)');
const contactPattern = new UrlPattern('/contact(/)');
const legalPattern = new UrlPattern('/legal(/)');

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
          style={{ position: 'relative' }}
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

// NEED TO BE LAZY LOADED ???? ...
const UnknownPage = dynamic(import('../components/UnknownPage'), {
  ssr: true,
  loading: () => <Loader />
});

const HomePage = dynamic(import('../components/HomePage'), {
  ssr: true,
  loading: () => <Loader />
});

class Index extends React.PureComponent {
  state = {
    minLoading: true
  };

  componentWillMount() {
    if (typeof window !== 'object') return;

    this.mediaQuery = window.matchMedia(`(max-width: ${MAX_WIDTH}px)`);
    this.mediaQuery.addListener(this.updateMatches);
    this.updateMatches();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ minLoading: false });
    }, MIN_LOAD_TIME);
  }

  componentWillUnmount() {
    this.mediaQuery.removeListener(this.updateMatches);
  }

  render() {
    const listRoutingDisabled = this.props.url.query.routing === 'disabled';

    let homeMatch = homePattern.match(this.props.url.asPath);
    let eventMatch = eventPattern.match(this.props.url.asPath);
    let searchMatch = searchPattern.match(this.props.url.asPath);
    let aboutMatch = aboutPattern.match(this.props.url.asPath);
    let contactMatch = contactPattern.match(this.props.url.asPath);
    let legalMatch = legalPattern.match(this.props.url.asPath);

    if (!eventMatch && !searchMatch) {
      this.props.dispatch(setEventListReadyFlag());
    }

    return (
      <Layout>
        {(eventMatch || searchMatch) &&
          (this.state.minLoading || !this.props.eventListReady) && (
            <SplashScreen />
          )}

        <Route test={homeMatch}>
          <HomePage />
        </Route>

        <Route test={aboutMatch}>
          <AboutPage />
        </Route>

        <Route test={contactMatch}>
          <ContactPage />
        </Route>

        <Route test={legalMatch}>
          <div>
            {`Mentions légales - Confidentialité - Conditions d'utilisation`}
          </div>
        </Route>

        <Route test={!listRoutingDisabled && eventMatch}>
          <EventPageContainer
            {...this.props}
            keyword={eventMatch && eventMatch.keyword}
          />
        </Route>

        <Route test={listRoutingDisabled || searchMatch}>
          <EventListContainer
            {...this.props}
            keyword={eventMatch && eventMatch.keyword}
          />
        </Route>

        <Route
          test={
            !homeMatch &&
            !aboutMatch &&
            !contactMatch &&
            !legalMatch &&
            !eventMatch &&
            !searchMatch
          }
        >
          <UnknownPage {...this.props} />
        </Route>
      </Layout>
    );
  }

  updateMatches = () =>
    this.props.dispatch(
      setMediaType(this.mediaQuery.matches ? MOBILE : DESKTOP)
    );
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
