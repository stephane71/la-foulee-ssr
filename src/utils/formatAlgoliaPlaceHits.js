export default function formatAlgoliaPlaceHits(hits) {
  return hits.map(
    ({ administrative, county, locale_names, _highlightResult, _geoloc }) => ({
      name: locale_names[0],
      administrative: administrative[0],
      county,
      match: _highlightResult.locale_names[0].value,
      location: _geoloc
    })
  );
}
