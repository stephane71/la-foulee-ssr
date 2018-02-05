function reduceEventList(events) {
  return events.reduce((current, next) => (current = current.concat(next)), []);
}

export function getFormatEventList(apiData) {
  return apiData
    ? { pages: apiData.pages, events: reduceEventList(apiData.strides) }
    : null;
}
