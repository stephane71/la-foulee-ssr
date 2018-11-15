import React from "react";
import { connect } from "react-redux";

import { setEventList, setPosition, setDepCode } from "../actions";
import { API_EVENT_LIST_AROUND, API_EVENT_LIST_DEPARTMENT } from "../api";

class EventsProvider extends React.Component {
  state = {
    events: this.props.events || [],
    loading: false
  };

  componentDidMount() {
    const { depCode, position, storedPosition, storedDepCode } = this.props;

    console.log({ depCode, position, storedPosition, storedDepCode });

    if (position && position !== storedPosition) {
      this.fetchEvents(API_EVENT_LIST_AROUND, position);
    }

    if (depCode && depCode !== storedDepCode) {
      this.fetchEvents(API_EVENT_LIST_DEPARTMENT, depCode);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { position } = nextProps;

    if (position !== this.props.position) {
      this.fetchEvents(API_EVENT_LIST_AROUND, position);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.position === nextProps.storedPosition) return false;
    if (nextProps.depCode === nextProps.storedDepCode) return false;

    return true;
  }

  render() {
    const { events, loading } = this.state;
    return this.props.children({ events, loading });
  }

  async fetchEvents(type, value) {
    this.setState({ loading: true });

    let res = await this.props.getEventList(type, value);
    this.props.dispatch(setEventList(res.events));
    this.setState({ events: res.events, loading: false });

    this.props.dispatch(
      setDepCode(type === API_EVENT_LIST_DEPARTMENT ? value : null)
    );
    this.props.dispatch(
      setPosition(type === API_EVENT_LIST_AROUND ? value : null)
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    storedPosition: state.position,
    storedDepCode: state.depCode
  };
}

export default connect(mapStateToProps)(EventsProvider);
