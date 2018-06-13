import Head from 'next/head';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import HomePage from '../components/HomePage';
import withUserPosition from '../components/withUserPosition';

import { getEventListStructuredData } from '../utils/structuredData';

import { toggleSearch } from '../actions';
import { DESKTOP } from '../enums';

import { pageview } from '../utils/gtag';

class Index extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSearchCityToggle = this.handleSearchCityToggle.bind(this);
  }

  componentDidMount() {
    // pageview({ title: 'Home', url: window.location.href, path: '/' });
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

const IndexCompose = compose(withUserPosition)(Index);

export default connect(mapStateToProps)(IndexCompose);
