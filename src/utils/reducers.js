export const getEventListReducer = function(eventList) {
  return eventList
    ? eventList.strides.reduce(
        (current, next) => (current = current.concat(next)),
        []
      )
    : [];
};
