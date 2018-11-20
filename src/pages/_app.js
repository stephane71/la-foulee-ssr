import React from "react";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";

import Layout from "../components/Layout";
import Media from "../components/Media";
import ApiProvider from "../components/ApiProvider";

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

    return (
      <Container>
        <Provider store={store}>
          <Media>
            <Layout>
              <ApiProvider>
                <Component
                  {...pageProps}
                  query={router.query || {}}
                  path={router.asPath}
                />
              </ApiProvider>
            </Layout>
          </Media>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(makeStore)(MyApp);
