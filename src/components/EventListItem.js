// should not be added !
// when using babel-plugin-inline-react-svg (added for project) && babel-plugin-react-require (added from next.js)
// read here https://github.com/kesne/babel-plugin-inline-react-svg/issues/31#issuecomment-342264348
import React from 'react';

import { getSpacing } from '../styles-variables';
import { white, dominant } from '../colors';
import Arrow from '../svgs/arrow_right_black_24px.svg';

const EVENT_ITEM_LOCATION_COLOR = '#808597';

export default ({
  data,
  onSelectEvent,
  withBorderRadiusTop,
  withBorderRadiusBottom
}) => (
  <div
    className={`event-list-item-root ${
      withBorderRadiusTop ? 'border-top' : ''
    } ${withBorderRadiusBottom ? 'border-bottom' : ''}`}
    onClick={() => onSelectEvent(data)}
  >
    <div className={`event-data`}>
      <h6 className={`title`}>{data.title}</h6>
      <div className={'location'}>{`${data.dep}, ${data.city}`}</div>
    </div>
    <Arrow style={{ fill: '#A0A7BD' }} />

    <style jsx>{`
      .event-list-item-root :active {
        background-color: #dcddda;
      }

      .event-list-item-root {
        display: flex;
        justify-content: space-between;
        padding: ${getSpacing('s')}px;
        align-items: center;
        background-color: ${white};
        margin: 0 ${getSpacing('s')}px;
        box-shadow: 0 10px 20px 0 rgba(38, 74, 67, 0.05);
      }

      .border-top {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      .border-bottom {
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
      }

      .event-data {
        max-width: calc(100% - 24px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .title {
        text-transform: capitalize;
        font-family: 'Circular-Bold-S';
        color: ${dominant};
        margin: 0;
      }

      .location {
        color: ${EVENT_ITEM_LOCATION_COLOR};
        font-weight: 400;
      }
    `}</style>
  </div>
);
