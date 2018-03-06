import dynamic from 'next/dynamic';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';

import { makeStore } from '../store';
import {
  setSelectedEvent,
  concatEventList,
  setEventListNbPages
} from '../actions';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

import Layout from '../components/Layout';
import Loader from '../components/Loader';

import { getFormatEventList } from '../utils/apiProxy';

// prevent EventListContainer to be mounted / unmounted at each changing route
let EventListContainer_LOADED = false;

const EventPageContainer = dynamic(import('../containers/EventPageContainer'), {
  ssr: true,
  loading: () => <Loader />
});

const EventListContainer = dynamic(import('../containers/EventListContainer'), {
  ssr: false,
  loading: () => <Loader />
});

const App = props => {
  let event = props.url.query.event;
  if (props.url.asPath === '/search') EventListContainer_LOADED = true;
  return (
    <Layout>
      <div className={`${event ? 'wrapper-show' : 'wrapper-hidden'}`}>
        {event && <EventPageContainer {...props} />}
      </div>
      {EventListContainer_LOADED && (
        <EventListContainer {...props} hide={event} />
      )}
    </Layout>
  );
};

App.getInitialProps = function({ store, isServer, ...context }) {
  let { query } = context;

  if (isServer) {
    if (query.event && query.event.title)
      store.dispatch(setSelectedEvent(query.event));

    if (query.eventList) {
      const { events, pages } = getFormatEventList(query.eventList);

      store.dispatch(concatEventList(events));
      store.dispatch(setEventListNbPages(pages));
    }
  }

  return {};
};

export default compose(withRedux(makeStore), withCredentials, withEventAPI)(
  App
);
