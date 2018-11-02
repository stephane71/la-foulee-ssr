import React from "react";
import { connect } from "react-redux";

import withGoogleMaps from "./withGoogleMaps";

import { GOOGLE_AUTOCOMPLETE_SERVICE } from "../enums";

const formatPredictions = predictions =>
  predictions.map(({ structured_formatting, place_id }) => ({
    value: structured_formatting.main_text,
    matched: structured_formatting.main_text_matched_substrings[0],
    placeId: place_id
  }));

class GoogleMapsAutocomplete extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      predictions: []
    };

    this.sessionToken = this.props.getSessionToken();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.input !== nextProps.input) {
      if (!nextProps.input) {
        this.setState({ predictions: [] });
        return;
      }

      this.props
        .getPredictions(nextProps.input, this.sessionToken)
        .then(predictions => this.setState({ predictions }));
    }
  }

  render() {
    const predictions = formatPredictions(this.state.predictions);

    return this.props.children({
      predictions,
      sessionToken: this.sessionToken
    });
  }
}

const WithGoogleMaps = withGoogleMaps(GoogleMapsAutocomplete);
export default connect()(WithGoogleMaps);
