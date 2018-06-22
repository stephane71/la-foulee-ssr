import moment from 'moment';

export const HEIGHT_APPBAR = 56;
export const BORDER_RADIUS = 4;
export const BORDER_RADIUS_LIST_ITEM = 10;
export const ICON_SIZE = 24;
export const MAX_WIDTH = 768;

export const LOCATION_FILTER = 'location';
export const DATE_FILTER = 'date';
export const DISTANCE_FILTER = 'distance';

export const DEFAULT_SELECTOR_VALUES = {
  [LOCATION_FILTER]: null,
  [DATE_FILTER]: moment().format('MMMM'),
  [DISTANCE_FILTER]: null
};

export const NO_EVENT_SELECTED = null;
export const DESKTOP = 'DESKTOP';
export const MOBILE = 'MOBILE';
export const DATE_FORMAT = 'dddd D MMMM';
export const USER_POSITION_KEY = 'userPosition';

export const GOOGLE_DETAILS_SERVICE = 'details';
export const GOOGLE_AUTOCOMPLETE_SERVICE = 'autocomplete';
export const GOOGLE_GEOCODING_SERVICE = 'geocoding';
