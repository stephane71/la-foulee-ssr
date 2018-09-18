import moment from 'moment';
import css from 'styled-jsx/css';

import EventListMonth from './EventListMonth';

import { getFontSize, getSpacing } from '../styles-variables';
import { getColor } from '../colors';

const style = css`
  .EventListWeek {
    font-size: ${getFontSize('s')}px;
    font-weight: 500;
    color: ${getColor('darkGrey', 'tonic')};
    padding: ${getSpacing('s')}px 0;
  }
`;

const EventListWeek = ({ day, eventDate }) => {
  const startOfWeek = day.clone().startOf('week');
  const endOfWeek = day.clone().endOf('week');

  const print = `${startOfWeek.date()} ${
    startOfWeek.date() > endOfWeek.date() ? startOfWeek.format('MMM') : ''
  } - ${endOfWeek.date()} ${endOfWeek.format('MMM')}`;

  const eventNotInMonth =
    startOfWeek.month() !== endOfWeek.month() &&
    (eventDate.month() > endOfWeek.month() ||
      eventDate.year() > endOfWeek.year());

  return (
    <>
      {(startOfWeek.date() === 1 || eventNotInMonth) && (
        <EventListMonth month={endOfWeek} />
      )}

      {startOfWeek.month() !== endOfWeek.month() &&
        eventDate.month() === endOfWeek.month() && (
          <EventListMonth month={endOfWeek} />
        )}

      <div className={'EventListWeek'}>
        {print}
        <style jsx>{style}</style>
      </div>

      {startOfWeek.month() !== endOfWeek.month() &&
        eventDate.month() === startOfWeek.month() && (
          <EventListMonth month={endOfWeek} />
        )}
    </>
  );
};

export default ({ data, index }) => {
  let diff = 0;
  const previousDay = index && moment.unix(data[index - 1].date);
  const currentDay = moment.unix(data[index].date);

  if (index) {
    diff = currentDay.week() - previousDay.week();
    if (diff < 0) diff += 52;
  }

  if (!index)
    return (
      <EventListWeek day={currentDay.clone()} eventDate={currentDay.clone()} />
    );

  if (!diff) return null;

  const weeks = [];
  for (let i = 1; i <= diff; i++) {
    weeks.push(previousDay.clone().add(i, 'weeks'));
  }

  return weeks.map((day, i) => (
    <EventListWeek key={i} day={day} eventDate={currentDay.clone()} />
  ));
};
