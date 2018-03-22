import {
  setEventList,
  concatEventList,
  setEventListNbPages,
  setCurrentPage
} from '../actions';

const FIRST_PAGE = 0;

const withEventList = WrappedComponent => {
  return class EventListWrapper extends React.Component {
    static displayName = `withEventList(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
    }

    state = {
      loading: true
    };

    async componentDidMount() {
      if (!this.props.events.length) {
        this.setState({ loading: true });

        const { events, pages } = await this.props.getEventList(
          this.props.selectors
        );
        this.props.dispatch(setEventList(events));
        this.props.dispatch(setEventListNbPages(pages));

        this.setState({ loading: false });
      }
    }

    async componentWillReceiveProps(nextProps) {
      if (this.props.currentMonth !== nextProps.currentMonth) {
        this.setState({ loading: true });

        const pages = await this.concatList(
          { ...this.props.selectors, month: nextProps.currentMonth },
          FIRST_PAGE
        );
        this.props.dispatch(setEventListNbPages(pages));

        this.firstPageRequestDone = true;
        this.props.dispatch(setCurrentPage(0));
      } else if (this.props.currentPage !== nextProps.currentPage) {
        if (this.firstPageRequestDone && nextProps.currentPage === 0) {
          this.firstPageRequestDone = false;
          return;
        }

        this.setState({ loading: true });
        await this.concatList(
          { ...this.props.selectors, month: this.props.currentMonth },
          nextProps.currentPage
        );
      } else if (this.props.selectors !== nextProps.selectors) {
        this.setState({ loading: true });
        // await this.refreshList(nextProps.selectors);
      }

      this.setState({ loading: false });
    }

    render() {
      return <WrappedComponent {...this.props} loading={this.state.loading} />;
    }

    // Prevent triggering the same req
    // dispatch setCurrentPage will be catch in the first test of this method
    firstPageRequestDone: false;

    async concatList(selectors, currentPage) {
      const { events, pages } = await this.props.getEventList(
        selectors,
        currentPage
      );
      this.props.dispatch(concatEventList(events));

      return pages;
    }

    async refreshList(selectors) {
      const { events, pages } = await this.props.getEventList(
        selectors,
        FIRST_PAGE
      );
      this.props.dispatch(setEventList(events));
      this.props.dispatch(setEventListNbPages(pages));

      this.firstPageRequestDone = true;
      this.props.dispatch(setCurrentPage(FIRST_PAGE));
      return pages;
    }
  };
};

export default withEventList;
