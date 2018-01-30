import Head from 'next/head';

import Layout from '../components/Layout';
import EventPageContainer from '../containers/EventPageContainer';

const Event = props => {
  return (
    <Layout>
      <EventPageContainer {...props} />
    </Layout>
  );
};

Event.getInitialProps = function(context) {
  let { query } = context;
  if (query.event && query.event.title) {
    return { event: query.event };
  }
  return { event: null };
};

export default Event;
