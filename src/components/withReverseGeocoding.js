import React from "react";
import getConfig from "next/config";
import algoliasearch from "algoliasearch/lite";

import formatAlgoliaPlaceHits from "../utils/formatAlgoliaPlaceHits";

const { publicRuntimeConfig } = getConfig();
const ALGOLIA_APPLICATION_ID = publicRuntimeConfig.ALGOLIA_APPLICATION_ID;
const ALGOLIA_API_KEY = publicRuntimeConfig.ALGOLIA_API_KEY;

const withReverseGeocoding = WrappedComponent =>
  class reverseGeocodingWrapper extends React.Component {
    constructor(props) {
      super(props);

      // 'applicationID', 'apiKey'
      this.places = algoliasearch.initPlaces(
        ALGOLIA_APPLICATION_ID,
        ALGOLIA_API_KEY
      );

      this.reverseGeocoding = this.reverseGeocoding.bind(this);
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          reverseGeocoding={this.reverseGeocoding}
        />
      );
    }

    reverseGeocoding(location) {
      return new Promise((resolve, reject) =>
        this.places.search(
          {
            type: "city",
            language: "fr",
            hitsPerPage: 2,
            aroundLatLng: `${location.lat},${location.lng}`
          },
          (err, res) => {
            if (err) reject(err);
            const place = formatAlgoliaPlaceHits(res.hits)[0];
            resolve(place);
          }
        )
      );
    }
  };

export default withReverseGeocoding;
