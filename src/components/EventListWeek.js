import moment from 'moment';
import css from 'styled-jsx/css';

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

const EventListWeek = ({ data, index }) => {
  let newWeek = false;
  let currentDay = moment.unix(data[index].date);

  if (index) {
    const previousDayWeek = moment.unix(data[index - 1].date).week();
    const currentDayWeek = moment.unix(data[index].date).week();
    newWeek = previousDayWeek !== currentDayWeek;
  } else {
    newWeek = true;
  }

  const startOfWeek = currentDay.startOf('week').date();
  const endOfWeek = currentDay.endOf('week').date();

  const print = `${startOfWeek} ${
    startOfWeek > endOfWeek ? currentDay.startOf('week').format('MMM') : ''
  } - ${endOfWeek} ${currentDay.endOf('week').format('MMM')}`;

  if (!newWeek) return null;
  return (
    <div className={'EventListWeek'}>
      {print}
      <style jsx>{style}</style>
    </div>
  );
};

export default EventListWeek;
