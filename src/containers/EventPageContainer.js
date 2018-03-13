import Head from 'next/head';
import { connect } from 'react-redux';

import EventPage from '../components/EventPage';
import Loader from '../components/Loader';

import { getEventStructuredData } from '../utils/structuredData';
import { MAX_WIDTH } from '../enums';
import { setEventListReadyFlag, setSelectedEvent } from '../actions';

export class EventPageContainer extends React.PureComponent {
  async componentDidMount() {
    if (!this.props.event && this.props.keyword) {
      let event = await this.props.getEvent(this.props.keyword);
      this.props.dispatch(setSelectedEvent(event));
      this.props.dispatch(setEventListReadyFlag());
    }
  }

  render() {
    const { event } = this.props;

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

function mapStateToProps(state) {
  return {
    event: state.event
  };
}

export default connect(mapStateToProps)(EventPageContainer);
