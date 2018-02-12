export const SET_SELECTED_EVENT = 'SET_SELECTED_EVENT';
export const CONCAT_EVENT_LIST = 'CONCAT_EVENT_LIST';
export const SET_EVENT_LIST = 'SET_EVENT_LIST';
export const SET_EVENT_LIST_NB_PAGES = 'SET_EVENT_LIST_NB_PAGES';
export const SET_SELECTORS = 'SET_SELECTORS';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

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
