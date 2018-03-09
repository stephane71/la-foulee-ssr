// should not be added !
// when using babel-plugin-inline-react-svg (added for project) && babel-plugin-react-require (added from next.js)
// read here https://github.com/kesne/babel-plugin-inline-react-svg/issues/31#issuecomment-342264348
import React from 'react';

import { getSpacing, getFontSize } from '../styles-variables';
import { white, dominant, SECONDARY_COLOR } from '../colors';
import Arrow from '../svgs/arrow_right_black_24px.svg';

const EVENT_ITEM_TITLE_COLOR = '#516E69';
const BORDER_RADIUS_LIST_ITEM = 10;

export default ({
  data,
  onSelectEvent,
  withBorderRadiusTop,
  withBorderRadiusBottom
}) => (
  <article
    rel={'bookmark'}
    className={`EventList-Item ${withBorderRadiusTop ? 'border-top' : ''} ${
      withBorderRadiusBottom ? 'border-bottom' : ''
    }`}
    onClick={() => onSelectEvent(data)}
    style={{ marginBottom: '1px' }}
  >
    <h6 className={`EventList-ItemTitle`}>{data.title}</h6>
    <address className={'EventList-ItemLocation'}>{`${data.dep}, ${
      data.city
    }`}</address>
    <Arrow
      className={'EventList-ItemIcon'}
      style={{
        fill: '#A0A7BD',
        position: 'absolute',
        right: '12px',
        top: 'calc(50% - 12px)'
      }}
    />

    <style jsx>{`
      .EventList-Item:active {
        background-color: #dcddda;
      }

      .EventList-Item {
        padding: ${getSpacing('s')}px;
        background-color: ${white};
        margin: 0 ${getSpacing('s')}px;
        box-shadow: 0 10px 20px 0 rgba(38, 74, 67, 0.05);
        position: relative;
      }

      .border-top {
        border-top-left-radius: ${BORDER_RADIUS_LIST_ITEM}px;
        border-top-right-radius: ${BORDER_RADIUS_LIST_ITEM}px;
      }

      .border-bottom {
        border-bottom-right-radius: ${BORDER_RADIUS_LIST_ITEM}px;
        border-bottom-left-radius: ${BORDER_RADIUS_LIST_ITEM}px;
      }

      .EventList-ItemTitle {
        text-transform: capitalize;
        font-family: 'Circular-Medium';
        color: ${EVENT_ITEM_TITLE_COLOR};
        font-weight: 500;
        margin: 0;
        width: calc(100% - ${getSpacing('m')}px);
      }

      .EventList-ItemLocation {
        color: ${SECONDARY_COLOR};
        font-weight: 400;
        font-size: ${getFontSize('s')}px;
        font-style: normal;
      }
    `}</style>
  </article>
);
