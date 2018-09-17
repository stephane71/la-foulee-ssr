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
  let newMonth = false;
  let currentDay = moment.unix(data[index].date);

  if (index) {
    const previousDayMonth = moment.unix(data[index - 1].date).month();
    const currentDayMonth = moment.unix(data[index].date).month();
    newMonth = currentDayMonth !== previousDayMonth;
  }

  if (!newMonth) return null;

  return (
    <div className={'EventListMonth'}>
      <div className={'EventListMonth-Line'}>
        <hr />
      </div>
      <span className={'EventListMonth-Month'}>
        {`${currentDay.format('MMMM')}${
          currentDay.year() !== moment().year() ? ` ${currentDay.year()}` : ''
        }`}
      </span>
      <div className={'EventListMonth-Line'}>
        <hr />
      </div>
      <style jsx>{style}</style>
    </div>
  );
};

export default EventListMonth;

// export default (props) => {
//
//   return
//   <EventListMonth {...props} />
// }
