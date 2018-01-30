import Head from 'next/head';

import Layout from '../components/Layout';
import EventPage from '../components/EventPage';
import Loader from '../components/Loader';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

import { getEventStructuredData } from '../utils/structuredData';

export class Event extends React.PureComponent {
  static async getInitialProps(context) {
    let { query } = context;
    if (query.event && query.event.title) {
      return { event: query.event };
    }
    return { event: null };
  }

  state = {
    event: this.props.event || null
  };

  async componentDidMount() {
    if (!this.state.event) {
      const event = await this.props.getEvent(this.props.url.query.event);
      this.setState({ event });
    }
  }

  render() {
    return (
      <Layout>
        {this.state.event && (
          <Head>
            <title>{`${this.state.event.title} | La Foulée`}</title>
            <script type={'application/ld+json'}>
              {getEventStructuredData(this.state.event)}
            </script>
          </Head>
        )}

        <div className={'EventPageContainer'}>
          {this.state.event ? (
            <EventPage data={this.state.event} />
          ) : (
            <Loader />
          )}
        </div>

        <style jsx>{`
          .EventPageContainer {
            margin: auto;
            max-width: 768px;
            height: 100%;
          }
        `}</style>
      </Layout>
    );
  }
}

export default withCredentials(withEventAPI(Event));
