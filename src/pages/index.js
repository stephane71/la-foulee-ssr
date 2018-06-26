import Router from 'next/router';
import Head from 'next/head';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import HomePage from '../components/HomePage';

import { getEventListStructuredData } from '../utils/structuredData';

import { toggleSearch } from '../actions';
import { DESKTOP } from '../enums';

import { pageview, event } from '../utils/gtag';

class Index extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSearchCityToggle = this.handleSearchCityToggle.bind(this);
  }

  componentDidMount() {
    Router.prefetch('/event');
    Router.prefetch('/events');

    pageview({
      title: 'Home',
      url: window.location.href,
      path: this.props.path
    });
  }

  render() {
    const { media } = this.props;

    return (
      <>
        <Head>
          <title>{`La Foulée | rechercher un evénement`}</title>
          <script type={'application/ld+json'}>
            {getEventListStructuredData()}
          </script>
        </Head>

        <HomePage
          onClick={this.handleSearchCityToggle}
          desktop={media === DESKTOP}
        />
      </>
    );
  }

  handleSearchCityToggle() {
    event({
      action: 'Trigger Search',
      category: 'Search',
      label: 'From index page'
    });

    this.props.dispatch(toggleSearch());
  }
}

Index.getInitialProps = function({ store, isServer, ...context }) {
  return {};
};

function mapStateToProps(state) {
  return {
    media: state.media
  };
}

export default connect(mapStateToProps)(Index);
