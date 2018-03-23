export const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';
export const CONCAT_EVENT_LIST = 'CONCAT_EVENT_LIST';
export const SET_EVENT_LIST = 'SET_EVENT_LIST';
export const SET_EVENT_LIST_NB_PAGES = 'SET_EVENT_LIST_NB_PAGES';
export const SET_SELECTORS = 'SET_SELECTORS';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_CURRENT_MONTH = 'SET_CURRENT_MONTH';
export const SET_GOOGLE_MAPS_SERVICE = 'SET_GOOGLE_MAPS_SERVICE';
export const SET_EVENT_LIST_READY_FLAG = 'SET_EVENT_LIST_READY_FLAG';
export const SET_MEDIA_TYPE = 'SET_MEDIA_TYPE';

export function setSelectedEvent(event) {
  return {
    type: SET_SELECTED_EVENT,
    event
  };
}

export function concatEventList(events) {
  return {
    type: CONCAT_EVENT_LIST,
    events
  };
}

export function setEventList(events) {
  return {
    type: SET_EVENT_LIST,
    events
  };
}

export function setEventListNbPages(pages) {
  return {
    type: SET_EVENT_LIST_NB_PAGES,
    pages
  };
}

export function setSelectors(selectors) {
  return {
    type: SET_SELECTORS,
    selectors
  };
}

export function setCurrentPage(currentPage) {
  return {
    type: SET_CURRENT_PAGE,
    currentPage
  };
}

export function setCurrentMonth() {
  return {
    type: SET_CURRENT_MONTH
  };
}

export function setGoogleMapsService(service) {
  return {
    type: SET_GOOGLE_MAPS_SERVICE,
    service
  };
}

export function setEventListReadyFlag() {
  return { type: SET_EVENT_LIST_READY_FLAG };
}

export function setMediaType(media) {
  return {
    type: SET_MEDIA_TYPE,
    media
  };
}
