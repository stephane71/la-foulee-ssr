import Head from 'next/head';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import EventListContainer from '../containers/EventListContainer';

import HomePage from '../components/HomePage';
import withUserPosition from '../components/withUserPosition';

import { getEventListStructuredData } from '../utils/structuredData';

import { toggleSearch } from '../actions';
import { MAX_WIDTH } from '../enums';

class Index extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      city: ''
    };

    this.handleSearchCityToggle = this.handleSearchCityToggle.bind(this);
  }

  render() {
    const { position, getEvent, getEventListAround, query } = this.props;

    return (
      <>
        <Head>
          <title>{`La Foulée | rechercher un evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventListStructuredData()}
          </script>
        </Head>

        {position ? (
          <EventListContainer
            getEvent={getEvent}
            getEventListAround={getEventListAround}
            keyword={query.keyword}
          />
        ) : (
          <HomePage onClick={this.handleSearchCityToggle} />
        )}
      </>
    );
  }

  handleSearchCityToggle() {
    this.props.dispatch(toggleSearch());
  }
}

Index.getInitialProps = function({ store, isServer, ...context }) {
  return {};
};

function mapStateToProps(state) {
  return {
    position: state.position
  };
}

const IndexCompose = compose(withUserPosition)(Index);

export default connect(mapStateToProps)(IndexCompose);
