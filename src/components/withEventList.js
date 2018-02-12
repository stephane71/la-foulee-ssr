import moment from 'moment';

import { setEventList, concatEventList } from '../actions';

const withEventList = WrappedComponent => {
  return class eventListWrapper extends React.Component {
    static displayName = `withEventList(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
    }

    state = {
      loading: false
    };

    async componentDidMount() {
      if (!this.props.events.length) {
        this.setState({ loading: true });

        const { events, pages } = await this.props.getEventList();
        this.props.dispatch(concatEventList(events));
        this.props.dispatch(setEventListNbPages(pages));

        this.setState({ loading: false });
      }
    }

    async componentWillReceiveProps(nextProps) {
      if (this.props.currentPage !== nextProps.currentPage) {
        this.setState({ loading: true });

        const { events } = await this.props.getEventList(
          this.props.selectors,
          nextProps.currentPage
        );
        this.props.dispatch(concatEventList(events));
      }

      if (this.props.selectors !== nextProps.selectors) {
        this.setState({ loading: true });

        const month = moment()
          .month(nextProps.selectors.month)
          .month();

        // TODO: manage the year of the event
        let selectors = { ...nextProps.selectors, month: `${month}-2018` };
        const { events } = await this.props.getEventList(selectors, 0);
        this.props.dispatch(setEventList(events));
      }
      this.setState({ loading: false });
    }

    render() {
      return <WrappedComponent {...this.props} loading={this.state.loading} />;
    }
  };
};

export default withEventList;
