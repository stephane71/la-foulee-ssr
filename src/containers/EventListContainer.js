import Head from 'next/head';
import Router from 'next/router';
import { Fragment } from 'react';
import { connect } from 'react-redux';

import EventList from '../components/EventList';
import withEventList from '../components/withEventList';

import { getEventListStructuredData } from '../utils/structuredData';

import {
  setSelectors,
  setCurrentPage,
  setCurrentMonth,
  setEventListReadyFlag,
  setSelectedEvent
} from '../actions';
import { MAX_WIDTH, NO_EVENT_SELECTED, DESKTOP } from '../enums';
import { Base } from '../styles-variables';
import { APP_BACKGROUND_COLOR, tonic } from '../colors';

export class EventListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleLoadPage = this.handleLoadPage.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleListRendered = this.handleListRendered.bind(this);
  }

  render() {
    return (
      <Fragment>
        <Head>
          <title>{`La Foulée | rechercher un evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventListStructuredData()}
          </script>
        </Head>

        <div className={'EventListContainer-mobile prevent-scroll'}>
          <EventList
            data={this.props.events}
            loading={this.props.loading}
            event={this.props.keyword ? this.props.event : NO_EVENT_SELECTED}
            endList={this.props.currentPage + 1 === this.props.pages}
            desktop={this.props.media === DESKTOP}
            onLoadMore={this.handleLoadPage}
            onSelectEvent={this.handleEventSelection}
            onListRendered={this.handleListRendered}
          />
        </div>

        <style jsx>{`
          .EventListContainer-mobile {
            background: ${APP_BACKGROUND_COLOR};
          }

          .EventListContainer-mobile:after {
            background: ${tonic};
            position: absolute;
            content: '';
            bottom: 0;
            left: 0;
            right: 0;
            clip-path: polygon(0 68%, 100% 0%, 100% 100%, 0% 100%);
            height: calc(${Base}px * 80);
          }
        `}</style>
      </Fragment>
    );
  }

  async handleLoadPage() {
    if (this.props.loading) return;

    if (this.props.currentPage + 1 === this.props.pages) {
      this.props.dispatch(setCurrentMonth());
    } else {
      this.props.dispatch(setCurrentPage(this.props.currentPage + 1));
    }
  }

  handleEventSelection(event) {
    if (event === NO_EVENT_SELECTED) {
      Router.back();
      return;
    }

    this.props.dispatch(setSelectedEvent(event));
    Router.push(
      { pathname: '/', query: { routing: 'disabled' } },
      `/event/${event.keyword}`
    );
  }

  handleListRendered() {
    this.props.dispatch(setEventListReadyFlag());
  }
}

function mapStateToProps(state) {
  return {
    event: state.event,
    selectors: state.selectors,
    events: state.events,
    pages: state.pages,
    currentPage: state.currentPage,
    currentMonth: state.currentMonth,
    media: state.media
  };
}

export default connect(mapStateToProps)(withEventList(EventListContainer));
