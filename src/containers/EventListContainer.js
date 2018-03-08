import { Fragment } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import css from 'styled-jsx/css';
import Media from 'react-media';

import {
  setSelectedEvent,
  setSelectors,
  setCurrentPage,
  setCurrentMonth
} from '../actions';

import { APP_BACKGROUND_COLOR } from '../colors';
import { tonic } from '../colors';
import { Base } from '../styles-variables';

import EventList from '../components/EventList';
import withEventList from '../components/withEventList';

import { getEventListStructuredData } from '../utils/structuredData';

export class EventListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleLoadPage = this.handleLoadPage.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleSelectorsValidation = this.handleSelectorsValidation.bind(this);
  }

  render() {
    return (
      <Fragment>
        {!this.props.hide && (
          <Head>
            <title>{`La Foulée | rechercher un evénement`}</title>
            <script type={'application/ld+json'}>
              {getEventListStructuredData()}
            </script>
          </Head>
        )}
        <div className={'eventListContainer-mobileWrapper prevent-scroll'}>
          <Media query={`(max-width: 768px)`}>
            {matches =>
              matches ? (
                <EventList
                  data={this.props.events}
                  onLoadMore={this.handleLoadPage}
                  loading={this.props.loading}
                  endList={this.props.currentPage + 1 === this.props.pages}
                  onSelectEvent={this.handleEventSelection}
                />
              ) : (
                <div className={'EventListContainerDesktop'} />
              )
            }
          </Media>
          <style jsx>{`
            .eventListContainer-mobileWrapper {
              display: ${this.props.hide ? 'none' : 'block'};
              background: ${APP_BACKGROUND_COLOR};
            }
            .eventListContainer-mobileWrapper:after {
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
        </div>
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
    this.props.dispatch(setSelectedEvent(event));
    Router.push(
      {
        pathname: '/app',
        query: { event: event.keyword }
      },
      `/event/${event.keyword}`
    );
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
