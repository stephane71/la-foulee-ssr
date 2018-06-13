export const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';
export const SET_EVENT_LIST = 'SET_EVENT_LIST';
export const SET_GOOGLE_MAPS_SERVICE = 'SET_GOOGLE_MAPS_SERVICE';
export const SET_MEDIA_TYPE = 'SET_MEDIA_TYPE';
export const SET_USER_POSITION = 'SET_USER_POSITION';
export const LOCAL_STORAGE_SET = 'LOCAL_STORAGE_SET';
export const TOGGLE_SEARCH = 'TOGGLE_SEARCH';
export const SET_EVENT_LIST_START_INDEX = 'SET_EVENT_LIST_START_INDEX';

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

export function localStorageSet(key, value) {
  return {
    type: LOCAL_STORAGE_SET,
    key,
    value
  };
}

export function toggleSearch(toggle) {
  return {
    type: TOGGLE_SEARCH,
    toggle
  };
}

export function setEventListStartIndex(index) {
  return {
    type: SET_EVENT_LIST_START_INDEX,
    index
  };
}
