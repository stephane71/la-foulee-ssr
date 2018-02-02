// should not be added !
// when using babel-plugin-inline-react-svg (added for project) && babel-plugin-react-require (added from next.js)
// read here https://github.com/kesne/babel-plugin-inline-react-svg/issues/31#issuecomment-342264348
import React from 'react';

import { getSpacing } from '../styles-variables';
import { white, listBorderColor } from '../colors';
import Arrow from '../svgs/arrow_right_black_24px.svg';

export default ({ data, lastItem, onSelectEvent }) => (
  <div
    className={`event-list-item-root ${lastItem ? `last-list-item` : ``}`}
    onClick={() => onSelectEvent(data)}
  >
    <div className={`event-data`}>
      <div className={`title`}>{data.title}</div>
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
        padding: ${getSpacing('s')}px ${getSpacing('m')}px;
        align-items: center;
        background-color: ${white};
        border-bottom: 1px solid ${listBorderColor};
      }

      .last-list-item {
        border-bottom: none;
      }

      .event-data {
        max-width: calc(100% - 24px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .title {
        font-weight: 500;
        text-transform: capitalize;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    `}</style>
  </div>
);
