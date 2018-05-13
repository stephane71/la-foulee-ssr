import Head from 'next/head';
import getConfig from 'next/config';
import { Fragment } from 'react';
import { connect } from 'react-redux';

import { setGoogleMapsService } from '../actions';
import { GOOGLE_DETAILS_SERVICE, GOOGLE_AUTOCOMPLETE_SERVICE } from '../enums';

const { publicRuntimeConfig } = getConfig();
const GOOGLE_PLACES_API_KEY = publicRuntimeConfig.GOOGLE_PLACES_API_KEY;

let service = null;

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api';
const GOOGLE_MAPS_OPTIONS = {
  types: ['(cities)'],
  componentRestrictions: { country: 'fr' }
};

const mapPredictionToSelectList = predictions =>
  predictions.map(({ structured_formatting, place_id }) => ({
    value: structured_formatting.main_text,
    matched: structured_formatting.main_text_matched_substrings[0],
    placeId: place_id
  }));

class GoogleMapPlacesApi extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      predictions: []
    };

    this.predictionCB = this.predictionCB.bind(this);

    window.initService = async () => {
      this.props.dispatch(
        setGoogleMapsService(
          GOOGLE_AUTOCOMPLETE_SERVICE,
          new google.maps.places.AutocompleteService()
        )
      );

      this.props.dispatch(
        setGoogleMapsService(
          GOOGLE_DETAILS_SERVICE,
          new google.maps.places.PlacesService(new google.maps.Map(''))
        )
      );
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.input !== nextProps.input) {
      if (!nextProps.input) {
        this.setState({ predictions: [] });
        return;
      }
      this.props.googleMapsServiceAutocomplete.getPlacePredictions(
        { ...GOOGLE_MAPS_OPTIONS, input: nextProps.input },
        this.predictionCB
      );
    }
  }

  render() {
    return (
      <Fragment>
        {!window.google && (
          <Head>
            <script
              src={`${GOOGLE_MAPS_API_URL}/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places&callback=initService`}
            />
          </Head>
        )}
        {this.props.children(mapPredictionToSelectList(this.state.predictions))}
      </Fragment>
    );
  }

  predictionCB(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      console.warn('No results found', status);
      return;
    }
    this.setState({ predictions });
  }

  static getDetails(service, placeId) {
    return new Promise((resolve, reject) => {
      service.getDetails({ placeId }, (place, status) => {
        status == google.maps.places.PlacesServiceStatus.OK
          ? resolve(place)
          : reject(status);
      });
    });
  }
}

function mapStateToProps(state) {
  return {
    googleMapsServiceAutocomplete:
      state.googleMapsService[GOOGLE_AUTOCOMPLETE_SERVICE]
  };
}

export default connect(mapStateToProps)(GoogleMapPlacesApi);
