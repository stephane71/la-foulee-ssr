import Head from 'next/head';
import { Fragment } from 'react';

let service = null;

const GOOGLE_MAPS_OPTIONS = {
  types: ['(cities)'],
  componentRestrictions: { country: 'fr' }
};

const mapPredictionToSelectList = predictions =>
  predictions.map(({ description }) => description);

class GoogleMapPlacesApi extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      predictions: [],
      scriptInserted: false
    };

    this.predictionCB = this.predictionCB.bind(this);
    this.service = null;

    window.initService = () => {
      this.service = new google.maps.places.AutocompleteService();
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.input !== nextProps.input) {
      this.service.getPlacePredictions(
        { ...GOOGLE_MAPS_OPTIONS, input: nextProps.input },
        this.predictionCB
      );
    }
  }

  render() {
    return (
      <Fragment>
        {!this.service && (
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

export default GoogleMapPlacesApi;
