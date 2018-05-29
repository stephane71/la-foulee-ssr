import React from 'react';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { compose } from 'redux';
import { Provider } from 'react-redux';

import Layout from '../components/Layout';
import Media from '../components/Media';

import withEventAPI from '../components/withEventAPI';
import withCredentials from '../components/withCredentials';

import { makeStore } from '../store';

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentWillMount() {
    if (typeof window !== 'object') return;

    // WARNING: This is a patch
    // Prevent NextJS LINK & ROUTER to mute the url by adding a trailing slash
    this.nextExportBuffer = __NEXT_DATA__.nextExport;
    __NEXT_DATA__.nextExport = false;
  }

  componentWillUnmount() {
    // WARNING: This is a patch
    // Prevent NextJS LINK & ROUTER to mute the url by adding a trailing slash
    __NEXT_DATA__.nextExport = this.nextExportBuffer;
  }

  render() {
    const { Component, pageProps, store, router } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Media>
            <Layout>
              <Component
                {...pageProps}
                getEvent={this.props.getEvent}
                getEventListAround={this.props.getEventListAround}
                query={router.query || {}}
              />
            </Layout>
          </Media>
        </Provider>
      </Container>
    );
  }

  nextExportBuffer = null;
}

export default compose(
  withRedux(makeStore, {
    debug: process.env.NODE_ENV === 'dev'
  }),
  withCredentials,
  withEventAPI
)(MyApp);
