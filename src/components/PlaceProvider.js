import React from "react";
import { connect } from "react-redux";

import { addPlace } from "../actions";

class PlaceProvider extends React.PureComponent {
  state = {
    place: this.props.placeMap[this.props.placeSlug] || null
  };

  componentDidMount() {
    const { placeSlug } = this.props;

    this.fetchPlace(placeSlug).then(place => this.setState({ place }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.placeSlug !== this.props.placeSlug) {
      this.fetchPlace(nextProps.placeSlug).then(place =>
        this.setState({ place })
      );
    }
  }

  render() {
    const { children } = this.props;
    const { place } = this.state;

    return typeof children === "function" ? children(place) : null;
  }

  async fetchPlace(placeSlug = null) {
    let place = this.props.placeMap[placeSlug] || null;

    if (placeSlug && !place) {
      place = await this.props.getPlace({ placeSlug });
      this.props.dispatch(addPlace(place));
    }

    return place;
  }
}

function mapStateToProps(state) {
  return {
    placeMap: state.placeMap
  };
}

export default connect(mapStateToProps)(PlaceProvider);
