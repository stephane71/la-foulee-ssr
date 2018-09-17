import moment from 'moment';
import css from 'styled-jsx/css';

import { getFontSize, getSpacing } from '../styles-variables';
import { getColor } from '../colors';

const style = css`
  .EventListMonth {
    font-size: ${getFontSize('s')}px;
    font-weight: 500;
    color: ${getColor('darkGrey', 'tonic')};
    padding: ${getSpacing('s')}px 0;

    display: flex;
    justify-content: space-between;
  }

  .EventListMonth-Line {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .EventListMonth-Line > hr {
    width: 100%;
  }

  .EventListMonth-Month {
    padding: 0 ${getSpacing('s')}px;
  }
`;

const EventListMonth = ({ data, index }) => {
  let diff = 0;
  let newMonth = false;
  let currentDay = moment.unix(data[index].date);

  const previousDay = index && moment.unix(data[index - 1].date);
  const previousDayMonth = index && previousDay.month();
  const currentDayMonth = moment.unix(data[index].date).month();

  if (index) {
    newMonth = currentDayMonth !== previousDayMonth;
    diff = currentDayMonth - previousDayMonth;
    if (diff < 0) diff += 12;
  }

  if (!diff) return null;

  let monthTab = [];
  for (let i = 1; i <= diff; i++) {
    let month = previousDay.clone().add(i, 'month');
    monthTab.push(
      `${month.format('MMMM')}${
        month.year() !== moment().year() ? ` ${month.year()}` : ''
      }`
    );
  }

  return monthTab.map((print, i) => (
    <div key={i} className={'EventListMonth'}>
      <div className={'EventListMonth-Line'}>
        <hr />
      </div>
      <span className={'EventListMonth-Month'}>{print}</span>
      <div className={'EventListMonth-Line'}>
        <hr />
      </div>
      <style jsx>{style}</style>
    </div>
  ));
};

export default EventListMonth;
