import moment from 'moment';

import { getSpacing } from '../styles-variables';

const EVENT_LIST_BORDER_COLOR = '#E7E8EA';
const EVENT_LIST_DATE_COLOR = '#F4F5F7';
const DATE_FORMAT = 'dddd D MMMM';

const EventListDate = props => (
  <div>
    {moment.unix(props.date).format(DATE_FORMAT)}
    <style jsx>{`
      div {
        background-color: ${EVENT_LIST_DATE_COLOR};
        padding: ${getSpacing(`s`)}px ${getSpacing(`m`)}px;
        font-weight: 500;
        border-bottom: 1px solid ${EVENT_LIST_BORDER_COLOR};
      }
    `}</style>
  </div>
);

export default EventListDate;
