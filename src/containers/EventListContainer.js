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
  setNextMonth
} from '../actions';

import EventList from '../components/EventList';
import withEventList from '../components/withEventList';

import { getEventListStructuredData } from '../utils/structuredData';

export class EventListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isScrolling: false
    };

    this.handleLoadPage = this.handleLoadPage.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleSelectorsValidation = this.handleSelectorsValidation.bind(this);
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
      </Fragment>
    );
  }

  handleSelectorsValidation(selectors) {
    this.props.dispatch(setSelectors(selectors));
  }

  async handleLoadPage() {
    if (this.props.loading) return;

    if (this.props.currentPage + 1 === this.props.pages) {
      this.props.dispatch(setNextMonth());
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
    currentPage: state.currentPage
  };
}

export default connect(mapStateToProps)(withEventList(EventListContainer));
