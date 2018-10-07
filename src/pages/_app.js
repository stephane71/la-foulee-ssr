import React from "react";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import { compose } from "redux";
import { Provider } from "react-redux";

import Layout from "../components/Layout";
import Media from "../components/Media";

import withEventAPI from "../components/withEventAPI";
import withCredentials from "../components/withCredentials";

import { makeStore } from "../store";

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store, router } = this.props;
    const {
      getEventListAround,
      postNewsletterEmail,
      postEventContribution,
      getCredentials
    } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <Media>
            <Layout query={router.query || {}} currentRoute={router.asPath}>
              <Component
                {...pageProps}
                getEventListAround={getEventListAround}
                postNewsletterEmail={postNewsletterEmail}
                postEventContribution={postEventContribution}
                getCredentials={getCredentials}
                query={router.query || {}}
                path={router.asPath}
              />
            </Layout>
          </Media>
        </Provider>
      </Container>
    );
  }
}

export default compose(
  withRedux(makeStore),
  withCredentials,
  withEventAPI
)(MyApp);
