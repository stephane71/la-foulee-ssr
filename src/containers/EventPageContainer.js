import Head from 'next/head';

import EventPage from '../components/EventPage';
import Loader from '../components/Loader';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

import { getEventStructuredData } from '../utils/structuredData';

export class EventPageContainer extends React.PureComponent {
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
    // !! WARNING !!
    // Does ld+json data set on header when navigate from client ?
    return (
      <div className={'EventPageContainer'}>
        {this.state.event && (
          <Head>
            <title>{`${this.state.event.title} | La Foulée`}</title>
            <script type={'application/ld+json'}>
              {getEventStructuredData(this.state.event)}
            </script>
          </Head>
        )}

        {this.state.event ? <EventPage data={this.state.event} /> : <Loader />}

        <style jsx>{`
          .EventPageContainer {
            margin: auto;
            max-width: 768px;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}

export default withCredentials(withEventAPI(EventPageContainer));
