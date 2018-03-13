import Head from 'next/head';
import Router from 'next/router';
import Media from 'react-media';
import { Fragment } from 'react';
import { connect } from 'react-redux';

import EventList from '../components/EventList';
import withEventList from '../components/withEventList';

import { getEventListStructuredData } from '../utils/structuredData';

import {
  setSelectedEvent,
  setSelectors,
  setCurrentPage,
  setCurrentMonth,
  setEventListReadyFlag
} from '../actions';
import { MAX_WIDTH } from '../enums';
import { Base } from '../styles-variables';
import { APP_BACKGROUND_COLOR, tonic } from '../colors';

export class EventListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleLoadPage = this.handleLoadPage.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleSelectorsValidation = this.handleSelectorsValidation.bind(this);
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

        <Media query={`(max-width: ${MAX_WIDTH}px)`}>
          {matches =>
            matches ? (
              <div className={'EventListContainer-mobile prevent-scroll'}>
                <EventList
                  data={this.props.events}
                  onLoadMore={this.handleLoadPage}
                  loading={this.props.loading}
                  endList={this.props.currentPage + 1 === this.props.pages}
                  onSelectEvent={this.handleEventSelection}
                  onListRendered={this.handleListRendered}
                />
              </div>
            ) : (
              <div className={'EventListContainer-desktop'} />
            )
          }
        </Media>
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

  handleSelectorsValidation(selectors) {
    this.props.dispatch(setSelectors(selectors));
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
    Router.push('/?routing=disabled', `/event/${event.keyword}`);
  }

  handleListRendered() {
    this.props.dispatch(setEventListReadyFlag());
  }
}

function mapStateToProps(state) {
  return {
    selectors: state.selectors,
    events: state.events,
    pages: state.pages,
    currentPage: state.currentPage,
    currentMonth: state.currentMonth
  };
}

export default connect(mapStateToProps)(withEventList(EventListContainer));
