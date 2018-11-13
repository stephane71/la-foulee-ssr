import React from "react";
import getConfig from "next/config";
import algoliasearch from "algoliasearch/lite";

const { publicRuntimeConfig } = getConfig();
const ALGOLIA_APPLICATION_ID = publicRuntimeConfig.ALGOLIA_APPLICATION_ID;
const ALGOLIA_API_KEY = publicRuntimeConfig.ALGOLIA_API_KEY;

const formatPredictions = predictions =>
  predictions.map(
    ({ administrative, county, locale_names, _highlightResult }) => ({
      name: locale_names[0],
      administrative: administrative[0],
      county,
      match: _highlightResult.locale_names[0].value
    })
  );

const DEFAULT_PARAMS_PLACE_SEARCH = {
  type: "city",
  language: "fr",
  countries: ["fr"],
  hitsPerPage: 5
};

class PlaceAutocomplete extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      predictions: []
    };

    // 'applicationID', 'apiKey'
    this.places = algoliasearch.initPlaces(
      ALGOLIA_APPLICATION_ID,
      ALGOLIA_API_KEY
    );

    // Reverse GEOCODING OK
    // this.places.search(
    //   {
    //     type: "city",
    //     language: "fr",
    //     hitsPerPage: 5,
    //     aroundLatLng: "48.847218,2.352428"
    //   },
    //   (err, res) => {
    //     if (err) throw err;
    //     console.log(res.hits);
    //   }
    // )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.input !== nextProps.input) {
      if (!nextProps.input) {
        this.setState({ predictions: [] });
        return;
      }

      this.algoliaSearch(nextProps.input).then(predictions =>
        this.setState({ predictions })
      );
    }
  }

  render() {
    return this.props.children({
      predictions: formatPredictions(this.state.predictions)
    });
  }

  algoliaSearch(input) {
    return new Promise((resolve, reject) =>
      this.places.search(
        { ...DEFAULT_PARAMS_PLACE_SEARCH, query: input },
        (err, res) => {
          if (err) throw err;
          resolve(res.hits);
        }
      )
    );
  }
}

export default PlaceAutocomplete;
