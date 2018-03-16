import Head from 'next/head';
import { Fragment } from 'react';
import { connect } from 'react-redux';

import { setGoogleMapsService } from '../actions';

let service = null;

const GOOGLE_MAPS_OPTIONS = {
  types: ['(cities)'],
  componentRestrictions: { country: 'fr' }
};

const mapPredictionToSelectList = predictions =>
  predictions.map(({ structured_formatting }) => ({
    value: structured_formatting.main_text,
    matched: structured_formatting.main_text_matched_substrings[0]
  }));

class GoogleMapPlacesApi extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      predictions: []
    };

    this.predictionCB = this.predictionCB.bind(this);

    window.initService = () => {
      // this.service = new google.maps.places.AutocompleteService();
      this.props.dispatch(
        setGoogleMapsService(new google.maps.places.AutocompleteService())
      );
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.input !== nextProps.input) {
      if (!nextProps.input) {
        this.setState({ predictions: [] });
        return;
      }
      this.props.googleMapsService.getPlacePredictions(
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
              src={`https://maps.googleapis.com/maps/api/js?key=${
                process.env.GOOGLE_PLACES_API_KEY
              }&libraries=places&callback=initService`}
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
}

function mapStateToProps(state) {
  return {
    googleMapsService: state.googleMapsService
  };
}

export default connect(mapStateToProps)(GoogleMapPlacesApi);
