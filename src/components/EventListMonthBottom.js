import moment from 'moment';
import css from 'styled-jsx/css';

import EventListMonth from './EventListMonth';

import { getSpacing } from '../styles-variables';

const style = css`
  .EventListMonthBottom {
    padding: ${getSpacing('m')}px;
    padding-bottom: 0;
  }
`;

const EventListMonthBottom = ({ data, index }) => {
  const eventDate = moment.unix(data[index].date);
  const endOfWeekDate = eventDate.clone().endOf('week');
  const nextEventDate = data[index + 1] && moment.unix(data[index + 1].date);

  if (
    eventDate.month() !== nextEventDate.month() &&
    eventDate.month() !== endOfWeekDate.month()
  )
    return (
      <div className={'EventListMonthBottom'}>
        <EventListMonth month={endOfWeekDate} />

        <style jsx>{style}</style>
      </div>
    );
  return null;
};

export default EventListMonthBottom;
