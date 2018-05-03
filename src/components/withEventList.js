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
      loading: true
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

    async fetchEvents(position) {
      this.setState({ loading: true });

      const { events } = await this.props.getEventListAround(position);
      this.props.dispatch(setEventList(events));

      this.setState({ loading: false });
    }
  };
};

export default withEventList;
