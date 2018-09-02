import Router from 'next/router';
import Head from 'next/head';
import getConfig from 'next/config';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import HomePage from '../components/HomePage';
import JSONLD from '../components/JSONLD';

import {
  getWebApplicationStructuredData,
  getOrganizationStructuredData
} from '../utils/structuredData';
import { pageview, event } from '../utils/gtag';

import { toggleSearch } from '../actions';
import { DESKTOP } from '../enums';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
const ASSETS_URL = publicRuntimeConfig.ASSETS_URL;

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

    const title = `Simplifier l'accès aux événements sportifs`;
    const description = `La Foulée simplifie la recherche d'un événement de course à pied. Trouvez les événements autour de vous et partagez les infos essentielles en un click !`;
    const imageTwitter = `${ASSETS_URL}/android-chrome-512x512.png`;
    const imageFB = `${ASSETS_URL}/glyph.dominant.144x144%402x.png`;

    return (
      <>
        <Head>
          <title>{`La Foulée | ${title}`}</title>
          <link rel={'canonical'} href={APP_URL} />
          <meta name={'description'} content={description} />

          {/* TWITTER */}
          <meta name={'twitter:card'} content={'summary'} />
          <meta name={'twitter:site'} content={'@_LaFoulee'} />
          <meta name={'twitter:title'} content={title} />
          <meta name={'twitter:description'} content={description} />
          <meta name={'twitter:image'} content={imageTwitter} />

          {/* OPEN GRAPH */}
          <meta property={'og:url'} content={APP_URL} />
          <meta property={'og:title'} content={title} />
          <meta property={'og:description'} content={description} />
          <meta property={'og:image'} content={imageFB} />
        </Head>

        <HomePage
          postNewsletterEmail={this.props.postNewsletterEmail}
          onClick={this.handleSearchCityToggle}
          desktop={media === DESKTOP}
        />

        <JSONLD data={getWebApplicationStructuredData()} />
        <JSONLD data={getOrganizationStructuredData()} />
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
