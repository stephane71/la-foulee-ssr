import Router from 'next/router';
import Head from 'next/head';
import css from 'styled-jsx/css';
import { connect } from 'react-redux';

import Event from '../components/Event';
import { ScrollElementContext } from '../components/Layout';

import { getEventStructuredData } from '../utils/structuredData';
import { pageview } from '../utils/gtag';

import { getSpacing } from '../styles-variables';
import { DESKTOP } from '../enums';
import { white } from '../colors';

const style = css`
  .Event-Page {
    height: 100%;
    overflow-y: scroll;
    background: ${white};
    -webkit-overflow-scrolling: touch;
  }

  .Event-Page--desktop {
    border-radius: 8px;
    margin: ${getSpacing('m')}px auto;
    height: calc(100% - ${getSpacing('l')}px);
  }
`;

class EventPage extends React.PureComponent {
  state = {
    desktop: false
  };

  componentDidMount() {
    Router.prefetch('/events');

    this.setState({ desktop: this.props.media === DESKTOP });

    // pageview({
    //   title: 'Event details',
    //   url: window.location.href,
    //   path: `/event/${this.props.query.event.keyword}`
    // });
  }

  render() {
    let event = this.props.query.event || this.props.event;

    return (
      <div
        className={`Event-Page ${
          this.state.desktop ? 'Event-Page--desktop' : ''
        }`}
      >
        <Head>
          <title>{`${event.title} | La Foulée`}</title>
          <script type={'application/ld+json'}>
            {getEventStructuredData(event)}
          </script>
        </Head>

        <ScrollElementContext.Consumer>
          {scrollElement => {
            if (scrollElement) scrollElement.scrollTop = 0;
            return null;
          }}
        </ScrollElementContext.Consumer>

        {event ? (
          <Event data={event} />
        ) : (
          <div>{`Cette évenement n'existe pas :(`}</div>
        )}

        <style jsx>{style}</style>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: state.event,
    media: state.media
  };
}

export default connect(mapStateToProps)(EventPage);
