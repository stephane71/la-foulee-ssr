import React from 'react';
import { connect } from 'react-redux';

import { GOOGLE_AUTOCOMPLETE_SERVICE } from '../enums';

const formatPredictions = predictions =>
  predictions.map(({ structured_formatting, place_id }) => ({
    value: structured_formatting.main_text,
    matched: structured_formatting.main_text_matched_substrings[0],
    placeId: place_id
  }));

const GOOGLE_MAPS_OPTIONS = {
  types: ['(cities)'],
  componentRestrictions: { country: 'fr' }
};

class GoogleMapsAutocomplete extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      predictions: []
    };

    this.predictionsCB = this.predictionsCB.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.input !== nextProps.input) {
      if (!nextProps.input) {
        this.setState({ predictions: [] });
        return;
      }
      this.props.googleMapsAutocompleteService.getPlacePredictions(
        { ...GOOGLE_MAPS_OPTIONS, input: nextProps.input },
        this.predictionsCB
      );
    }
  }

  render() {
    const predictions = formatPredictions(this.state.predictions);

    return this.props.children(predictions);
  }

  predictionsCB(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      console.warn('No results found', status);
      // WARNING Should we return an empty array for predictions instead ?
      return;
    }
    this.setState({ predictions });
  }
}

function mapStateToProps(state) {
  return {
    googleMapsAutocompleteService:
      state.googleMapsService[GOOGLE_AUTOCOMPLETE_SERVICE]
  };
}

export default connect(mapStateToProps)(GoogleMapsAutocomplete);
