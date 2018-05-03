import {
  setEventList,
  concatEventList,
  setEventListNbPages,
  setCurrentPage,
  setSelectors
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

        this.setState({ loading: false });
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
        this.setState({ loading: false });
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          loading={this.state.loading}
          fetchEvents={this.fetchEvents.bind(this)}
        />
      );
    }

    // Prevent triggering the same req
    // dispatch setCurrentPage will be catch in the first test of this method
    firstPageRequestDone = false;

    async concatList(selectors, currentPage) {
      const { events, pages } = await this.props.getEventList(
        selectors,
        currentPage
      );
      this.props.dispatch(concatEventList(events));

      return pages;
    }

    async fetchEvents(position) {
      this.setState({ loading: true });

      const { events } = await this.props.getAroundEventList(
        { location: position },
        FIRST_PAGE
      );
      this.props.dispatch(setEventList(events));

      this.setState({ loading: false });
    }
  };
};

export default withEventList;
