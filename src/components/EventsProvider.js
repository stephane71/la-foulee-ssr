import React from "react";
import { connect } from "react-redux";

import { setEventList, setPosition } from "../actions";
import { API_EVENT_LIST_AROUND } from "../api";

class EventsProvider extends React.PureComponent {
  state = {
    events: this.props.events || [],
    loading: false
  };

  componentDidMount() {
    const { position, storedPosition } = this.props;

    if (position !== storedPosition) {
      this.updateFromPosition(position);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { position } = nextProps;

    if (position !== this.props.position) {
      this.updateFromPosition(position);
    }
  }

  render() {
    const { events, loading } = this.state;
    return this.props.children({ events, loading });
  }

  updateFromPosition(position) {
    this.setState({ loading: true });
    this.fetchEvents(API_EVENT_LIST_AROUND, position).then(events => {
      this.setState({ events, loading: false });
      this.props.dispatch(setPosition(position));
    });
  }

  async fetchEvents(type, value) {
    let res = await this.props.getEventList(type, value);
    this.props.dispatch(setEventList(res.events));
    return res.events;
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    storedPosition: state.position
  };
}

export default connect(mapStateToProps)(EventsProvider);
