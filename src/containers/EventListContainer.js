import { Fragment } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import css from 'styled-jsx/css';
import Media from 'react-media';

import { setSelectedEvent, setSelectors, setCurrentPage } from '../actions';

import MobileWrapper from '../components/MobileWrapper';
import Loader from '../components/Loader';
import EventList from '../components/EventList';
import Selectors from '../components/Selectors';
import withEventList from '../components/withEventList';

import { getEventListStructuredData } from '../utils/structuredData';

import { listBorderColor, getColor } from '../colors';
import { HEIGHT_MOBILE_SEARCH_INPUT } from '../enums';

const EventListContainerDesktop = css`
  .EventListContainerDesktop {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .EventListContainerDesktop--selectors {
    height: 100%;
    width: 40%;
  }

  .EventListContainerDesktop--list {
    height: 100%;
    width: 60%;
  }
`;

export class EventListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isScrolling: false
    };

    this.handleLoadPage = this.handleLoadPage.bind(this);
    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleSelectorsValidation = this.handleSelectorsValidation.bind(this);

    this.isScrolling = this.isScrolling.bind(this);
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
              <MobileWrapper isScrolling={this.state.isScrolling}>
                {this.getEventListComponent()}
                <Selectors validate={this.handleSelectorsValidation} />
              </MobileWrapper>
            ) : (
              <div className={'EventListContainerDesktop'}>
                <div className={'EventListContainerDesktop--selectors'}>
                  <Selectors validate={this.handleSelectorsValidation} />
                </div>
                <div className={'EventListContainerDesktop--list'}>
                  {this.getEventListComponent()}
                </div>
                <style jsx>{EventListContainerDesktop}</style>
              </div>
            )
          }
        </Media>
      </Fragment>
    );
  }

  getEventListComponent = () => {
    return (
      <div className={'EventListComponent'}>
        <EventList
          data={this.props.events}
          onLoadMore={this.handleLoadPage}
          loading={this.props.loading}
          endList={this.props.currentPage + 1 === this.props.pages}
          onSelectEvent={this.handleEventSelection}
          isScrolling={this.isScrolling}
        />
        <style jsx>{`
          .EventListComponent {
            height: auto;
            margin: auto;
            max-width: 768px;
            border-right: 1px solid ${listBorderColor};
            border-left: 1px solid ${listBorderColor};
            padding-top: ${HEIGHT_MOBILE_SEARCH_INPUT}px;
          }
        `}</style>
      </div>
    );
  };

  isScrolling(down) {
    this.setState({ isScrolling: down });
  }

  handleSelectorsValidation(selectors) {
    this.props.dispatch(setSelectors(selectors));
  }

  async handleLoadPage() {
    if (this.props.loading) return;
    this.props.dispatch(setCurrentPage(this.props.currentPage + 1));
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
