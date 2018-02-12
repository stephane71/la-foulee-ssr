import moment from 'moment';

import {
  setEventList,
  concatEventList,
  setEventListNbPages,
  setCurrentPage
} from '../actions';

function getSelectors(selectors) {
  const month = moment()
    .month(selectors.month)
    .month();

  return { ...selectors, month: `${month}-2018` };
}

const withEventList = WrappedComponent => {
  return class eventListWrapper extends React.Component {
    static displayName = `withEventList(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
    }

    state = {
      loading: false,
      loadingPage: false
    };

    async componentDidMount() {
      if (!this.props.events.length) {
        this.setState({ loading: true });

        const { events, pages } = await this.props.getEventList();
        this.props.dispatch(setEventList(events));
        this.props.dispatch(setEventListNbPages(pages));

        this.setState({ loading: false });
      }
    }

    async componentWillReceiveProps(nextProps) {
      if (this.props.currentPage !== nextProps.currentPage) {
        if (this.firstPageRequestDone && nextProps.currentPage === 0) {
          this.firstPageRequestDone = false;
          return;
        }

        this.setState({ loading: true, loadingPage: true });

        const { events } = await this.props.getEventList(
          getSelectors(this.props.selectors),
          nextProps.currentPage
        );
        this.props.dispatch(concatEventList(events));
      }

      if (this.props.selectors !== nextProps.selectors) {
        this.setState({ loading: true });

        // TODO: manage the year of the event
        const { events, pages } = await this.props.getEventList(
          getSelectors(nextProps.selectors),
          0
        );

        this.props.dispatch(setEventList(events));
        this.props.dispatch(setEventListNbPages(pages));

        this.firstPageRequestDone = true;
        this.props.dispatch(setCurrentPage(0));
      }
      this.setState({ loading: false, loadingPage: false });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          loading={this.state.loading}
          loadingPage={this.state.loadingPage}
        />
      );
    }

    // Prevent triggering the same req
    // dispatch setCurrentPage will be catch in the first test of this method
    firstPageRequestDone: false;
  };
};

export default withEventList;
