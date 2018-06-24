import Head from 'next/head';
import getConfig from 'next/config';

import { setGoogleMapsService } from '../actions';
import {
  GOOGLE_AUTOCOMPLETE_SERVICE,
  GOOGLE_DETAILS_SERVICE,
  GOOGLE_GEOCODING_SERVICE
} from '../enums';

const { publicRuntimeConfig } = getConfig();

const GOOGLE_PLACES_API_KEY = publicRuntimeConfig.GOOGLE_PLACES_API_KEY;
const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api';

class GoogleMapInitServices extends React.PureComponent {
  constructor(props) {
    super(props);

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

      this.props.dispatch(
        setGoogleMapsService(
          GOOGLE_GEOCODING_SERVICE,
          new google.maps.Geocoder()
        )
      );
    };
  }

  render() {
    return (
      !window.google && (
        <Head>
          <script
            src={`${GOOGLE_MAPS_API_URL}/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places&callback=initService`}
          />
        </Head>
      )
    );
  }
}

export default GoogleMapInitServices;
