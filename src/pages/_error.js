import React from 'react';

import EventNotFoundError from '../components/NotFoundError';

import { PAGE_NOT_FOUND, EVENT_NOT_FOUND } from '../errors';

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;

    return <EventNotFoundError title={this.getError(statusCode)} />;
  }

  getError(error) {
    const DEFAULT_ERROR = `404 - Cette page n'existe pas`;
    switch (error) {
      case PAGE_NOT_FOUND:
        return DEFAULT_ERROR;
      case EVENT_NOT_FOUND:
        return `404 - Nous ne connaissons pas cet évenement.`;
        break;
      default:
        return DEFAULT_ERROR;
    }
  }
}
