function reduceEventList(events) {
  return events.reduce((current, next) => (current = current.concat(next)), []);
}
