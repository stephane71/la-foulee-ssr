import moment from 'moment';

import { getSpacing } from '../styles-variables';
import { getFontSize } from '../styles-variables';
import { dominant } from '../colors';

const DATE_FORMAT = 'dddd D MMMM';

function getWeeklyDay(date) {
  return moment.unix(date).format('dddd');
}

function getDate(date) {
  return moment.unix(date).format('D MMMM');
}

function getDateSemantic(date) {
  return moment.unix(date).format('YYYY-MM-DD');
}

const EventListDate = ({ date, marginTop }) => (
  <time
    className={`EventList-Date ${marginTop ? 'EventList-Date--marginTop' : ''}`}
    dateTime={getDateSemantic(date)}
  >
    <span className={'weeklyDay'}>{getWeeklyDay(date)}</span>{' '}
    <span>{getDate(date)}</span>
    <style jsx>{`
      .EventList-Date {
        text-transform: capitalize;
        padding: ${getSpacing(`m`)}px;
        color: ${dominant};
        font-weight: 500;
        font-size: ${getFontSize('l')}px;
        display: block;
      }

      .EventList-Date--marginTop {
        margin-top: ${getSpacing('l')}px;
      }

      .weeklyDay {
        font-weight: 300;
      }
    `}</style>
  </time>
);

export default EventListDate;
