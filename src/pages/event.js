import Router from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import css from 'styled-jsx/css';
import { connect } from 'react-redux';

import EventDetails from '../components/EventDetails';
import { ScrollElementContext } from '../components/Layout';

import { getEventStructuredData } from '../utils/structuredData';
import { pageview } from '../utils/gtag';

import { getSpacing } from '../styles-variables';
import { DESKTOP } from '../enums';
import { white } from '../colors';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;

const style = css`
  .EventPage {
    min-height: 100%;
    ${'' /* Prevent no rendering page in Safari mobile */} overflow-y: scroll;
    background: ${white};
    -webkit-overflow-scrolling: touch;
  }

  .EventPage--desktop {
    overflow-y: initial;
  }
`;

class EventPage extends React.PureComponent {
  static getInitialProps({ isServer }) {
    return { isServer };
  }

  state = {
    desktop: false,
    isServer: this.props.isServer
  };

  componentDidMount() {
    Router.prefetch('/events');

    this.setState({ desktop: this.props.media === DESKTOP, isServer: false });

    pageview({
      title: 'Event details',
      url: window.location.href,
      path: this.props.path
    });
  }

  render() {
    let event = this.props.query.event || this.props.event;
    let { path } = this.props;

    return (
      <div
        className={`EventPage ${
          this.state.desktop ? 'EventPage--desktop' : ''
        }`}
      >
        <Head>
          <title>{`${event.title} | La Foulée`}</title>
          <link rel={'canonical'} href={`${APP_URL}${path}`} />
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
          <EventDetails
            data={event}
            desktop={this.state.desktop}
            isServer={this.state.isServer}
            onClickOrgaLink={this.handleClickOrgaLink}
          />
        ) : (
          <div>{`Cette évenement n'existe pas :(`}</div>
        )}

        <style jsx>{style}</style>
      </div>
    );
  }

  handleClickOrgaLink(href = '') {
    event({
      action: 'Orga Link',
      category: 'Event',
      label: 'Click on orga link',
      value: href
    });
  }
}

function mapStateToProps(state) {
  return {
    event: state.event,
    media: state.media
  };
}

export default connect(mapStateToProps)(EventPage);
