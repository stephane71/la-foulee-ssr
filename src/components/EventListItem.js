// should not be added !
// when using babel-plugin-inline-react-svg (added for project) && babel-plugin-react-require (added from next.js)
// read here https://github.com/kesne/babel-plugin-inline-react-svg/issues/31#issuecomment-342264348
import React, { Fragment } from 'react';

import { getSpacing, getFontSize } from '../styles-variables';
import { white, SECONDARY_COLOR } from '../colors';
import Arrow from '../svgs/arrow_right_black_24px.svg';

const EVENT_ITEM_TITLE_COLOR = '#516E69';
const BORDER_RADIUS_LIST_ITEM = 10;

/*
  WARNING !!
  The choosen dom's structure embed an <article> in an other <article>: see EventShort
  Is this wanted ?
*/

const EventShort = ({ data }) => (
  <Fragment>
    <article className={`event-data`}>
      <h6 className={`title`}>{data.title}</h6>
      <address className={'location'}>{`${data.dep}, ${data.city}`}</address>
    </article>
    <Arrow style={{ fill: '#A0A7BD' }} />
    <style jsx>{`
      .event-data {
        max-width: calc(100% - 24px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .title {
        text-transform: capitalize;
        font-family: 'Circular-Medium';
        color: ${EVENT_ITEM_TITLE_COLOR};
        font-weight: 500;
        margin: 0;
      }

      .location {
        color: ${SECONDARY_COLOR};
        font-weight: 400;
        font-size: ${getFontSize('s')}px;
        font-style: normal;
      }
    `}</style>
  </Fragment>
);

const EventListItem = ({
  data,
  onSelectEvent,
  withBorderRadiusTop,
  withBorderRadiusBottom
}) => (
  <article
    rel={'bookmark'}
    className={`EventListItem ${withBorderRadiusTop ? 'border-top' : ''} ${
      withBorderRadiusBottom ? 'border-bottom' : ''
    }`}
    onClick={() => onSelectEvent(data)}
  >
    <EventShort data={data} />

    <style jsx>{`
      .EventListItem {
        display: flex;
        justify-content: space-between;
        padding: ${getSpacing('s')}px;
        align-items: center;
        background-color: ${white};
        margin: 0 ${getSpacing('s')}px;
        box-shadow: 0 10px 20px 0 rgba(38, 74, 67, 0.05);
        position: relative;
        margin-bottom: 1px;
      }

      .border-top {
        border-top-left-radius: ${BORDER_RADIUS_LIST_ITEM}px;
        border-top-right-radius: ${BORDER_RADIUS_LIST_ITEM}px;
      }

      .border-bottom {
        border-bottom-right-radius: ${BORDER_RADIUS_LIST_ITEM}px;
        border-bottom-left-radius: ${BORDER_RADIUS_LIST_ITEM}px;
      }
    `}</style>
  </article>
);

export default EventListItem;
