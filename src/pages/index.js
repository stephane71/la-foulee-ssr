import Router from 'next/router';
import dynamic from 'next/dynamic';
import withRedux from 'next-redux-wrapper';
import pathToRegexp from 'path-to-regexp';
import { compose } from 'redux';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

import SplashScreen from '../components/SplashScreen';
import Loader from '../components/Loader';
import Layout from '../components/Layout';
import AboutPage from '../components/AboutPage';
import ContactPage from '../components/ContactPage';

import Route from '../routes';
import { MAX_WIDTH, DESKTOP, MOBILE } from '../enums';
import { setEventListReadyFlag, setMediaType } from '../actions';
import { makeStore } from '../store';

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
const ClientRedirects = dynamic(import('../components/ClientRedirects'), {
  ssr: false,
  loading: () => null
});

const regexpEventEP = pathToRegexp('/event/:keyword');
const MIN_LOAD_TIME = 2000;

class Index extends React.PureComponent {
  state = {
    minLoading: true
  };

  componentWillMount() {
    if (typeof window !== 'object') return;

    this.mediaQuery = window.matchMedia(`(max-width: ${MAX_WIDTH}px)`);
    this.mediaQuery.addListener(this.updateMatches);
    this.updateMatches();

    // WARNING: This is a patch
    // Prevent NextJS LINK & ROUTER to mute the url by adding a trailing slash
    this.nextExportBuffer = __NEXT_DATA__.nextExport;
    __NEXT_DATA__.nextExport = false;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ minLoading: false });
    }, MIN_LOAD_TIME);
  }

  componentWillUnmount() {
    this.mediaQuery.removeListener(this.updateMatches);

    // WARNING: This is a patch
    // Prevent NextJS LINK & ROUTER to mute the url by adding a trailing slash
    __NEXT_DATA__.nextExport = this.nextExportBuffer;
  }

  render() {
    const { asPath } = this.props.url;
    const fromSearchRoute = this.props.url.query.from === 'search';

    this.props.dispatch(setEventListReadyFlag());

    const matchKeyword = regexpEventEP.exec(asPath);
    const keyword = matchKeyword && matchKeyword.length > 1 && matchKeyword[1];

    return (
      <Layout>
        <ClientRedirects position={this.props.position} />

        {(this.state.minLoading || !this.props.eventListReady) && (
          <SplashScreen />
        )}

        <Route url={asPath} path={'/'}>
          <HomePage />
        </Route>

        <Route url={asPath} path={'/about'}>
          <AboutPage />
        </Route>

        <Route url={asPath} path={'/contact'}>
          <ContactPage />
        </Route>

        <Route url={asPath} path={'/legal'}>
          <div>
            {`Mentions légales - Confidentialité - Conditions d'utilisation`}
          </div>
        </Route>

        <Route
          url={asPath}
          path={'/event/:keyword'}
          forceHide={fromSearchRoute}
        >
          <EventPageContainer {...this.props} keyword={keyword} />
        </Route>

        <Route
          url={asPath}
          path={['/search', '/event/:keyword']}
          forceHide={keyword && !fromSearchRoute}
        >
          {this.props.position && (
            <EventListContainer {...this.props} keyword={keyword} />
          )}
        </Route>

        <Route
          url={asPath}
          path={[
            '/',
            '/about',
            '/contact',
            '/legal',
            '/event/:keyword',
            '/search'
          ]}
        >
          {show => !show && <UnknownPage {...this.props} />}
        </Route>
      </Layout>
    );
  }

  nextExportBuffer = null;

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
    eventListReady: state.eventListReady,
    position: state.position
  };
}

export default compose(
  withRedux(makeStore, mapStateToProps),
  withCredentials,
  withEventAPI
)(Index);
