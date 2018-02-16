import moment from 'moment';

import { getSpacing } from '../styles-variables';
import { dominant } from '../colors';

const DATE_FORMAT = 'dddd D MMMM';

function getWeeklyDay(date) {
  return moment.unix(date).format('dddd');
}

function getDate(date) {
  return moment.unix(date).format('D MMMM');
}

const EventListDate = ({ date }) => (
  <h5>
    <span className={'weeklyDay'}>{getWeeklyDay(date)}</span>{' '}
    <span>{getDate(date)}</span>
    <style jsx>{`
      h5 {
        text-transform: capitalize;
        padding: ${getSpacing(`m`)}px;
        padding-top: ${getSpacing('ls')}px;
        margin: 0;
        color: ${dominant};
        font-weight: 500;
      }

      .weeklyDay {
        font-weight: 300;
      }
    `}</style>
  </h5>
);

export default EventListDate;
