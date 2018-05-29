import { setEventList } from '../actions';

const withEventList = WrappedComponent => {
  return class EventListWrapper extends React.Component {
    static displayName = `withEventList(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static getInitialProps(context) {
      return WrappedComponent.getInitialProps(context);
    }

    state = {
      loading: false
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          loading={this.state.loading}
          fetchEvents={this.fetchEvents.bind(this)}
        />
      );
    }

    async fetchEvents(geohash) {
      this.setState({ loading: true });

      const { events } = await this.props.getEventListAround(geohash);
      this.props.dispatch(setEventList(events));

      this.setState({ loading: false });
    }
  };
};

export default withEventList;
