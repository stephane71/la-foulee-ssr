export const SET_SELECTED_EVENT = "SET_SELECTED_EVENT";
export const SET_EVENT_LIST = "SET_EVENT_LIST";
export const SET_GOOGLE_MAPS_SERVICE = "SET_GOOGLE_MAPS_SERVICE";
export const SET_MEDIA_TYPE = "SET_MEDIA_TYPE";
export const SET_USER_POSITION = "SET_USER_POSITION";
export const TOGGLE_SEARCH = "TOGGLE_SEARCH";
export const SET_SEARCHING_GEOHASH = "SET_SEARCHING_GEOHASH";
export const ADD_PLACE = "ADD_PLACE";

export function setSelectedEvent(event) {
  return {
    type: SET_SELECTED_EVENT,
    event
  };
}

export function setEventList(events) {
  return {
    type: SET_EVENT_LIST,
    events
  };
}

export function setGoogleMapsService(service, value) {
  return {
    type: SET_GOOGLE_MAPS_SERVICE,
    service,
    value
  };
}

export function setMediaType(media) {
  return {
    type: SET_MEDIA_TYPE,
    media
  };
}

export function setUserPosition(position) {
  return {
    type: SET_USER_POSITION,
    position
  };
}

export function toggleSearch(toggle) {
  return {
    type: TOGGLE_SEARCH,
    toggle
  };
}

export function setSearchingGeohash(searching) {
  return {
    type: SET_SEARCHING_GEOHASH,
    searching
  };
}

export function addPlace(place) {
  return {
    type: ADD_PLACE,
    place
  };
}
