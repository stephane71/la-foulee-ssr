import Head from 'next/head';

import EventPage from '../components/EventPage';

import { getEventStructuredData } from '../utils/structuredData';
import { MAX_WIDTH } from '../enums';

export class EventPageContainer extends React.PureComponent {
  state = {
    event: null
  };

  async componentDidMount() {
    let event = await this.props.getEvent(this.props.keyword);
    this.setState({ event });
  }

  render() {
    const { event } = this.state;

    if (!event) return null;

    if (event.errorMessage) {
      return (
        <div className={'EventPageContainer'} style={{ textAlign: 'center' }}>
          <h3>{`This event doesn't exist!`}</h3>
        </div>
      );
    }

    return (
      <div className={'EventPageContainer'}>
        <Head>
          <title>{`${event.title} | La Foulée`}</title>
          <script type={'application/ld+json'}>
            {getEventStructuredData(event)}
          </script>
        </Head>

        <EventPage data={event} />

        <style jsx>{`
          .EventPageContainer {
            margin: auto;
            max-width: ${MAX_WIDTH}px;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}

export default EventPageContainer;
