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

  componentDidMount() {
    setTimeout(() => {
      this.setState({ minLoading: false });
    }, MIN_LOAD_TIME);
  }

  render() {
    const listRoutingDisabled = this.props.url.query.routing === 'disabled';

    let homeMatch = homePattern.match(this.props.url.asPath);
    let eventMatch = eventPattern.match(this.props.url.asPath);
    let searchMatch = searchPattern.match(this.props.url.asPath);
    let aboutMatch = aboutPattern.match(this.props.url.asPath);
    let contactMatch = contactPattern.match(this.props.url.asPath);
    let legalMatch = legalPattern.match(this.props.url.asPath);

    return (
      <Layout>
        {!homeMatch &&
          (this.state.minLoading || !this.props.eventListReady) && (
            <SplashScreen />
          )}

        <Route test={homeMatch}>
          <HomePage {...this.props} />
        </Route>

        <Route test={aboutMatch}>
          <div>{'About page'}</div>
        </Route>

        <Route test={contactMatch}>
          <div>{'Contact page'}</div>
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
          <EventListContainer {...this.props} />
        </Route>

        <Route test={!homeMatch && !eventMatch && !searchMatch}>
          <UnknownPage {...this.props} />
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
