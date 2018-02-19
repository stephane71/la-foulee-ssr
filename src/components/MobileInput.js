import React from 'react';

import SearchIcon from '../svgs/ic_search_white_24px.svg';

import { BORDER_RADIUS } from '../enums';
import { getSpacing } from '../styles-variables';
import {
  white,
  listBorderColor,
  getColor,
  APP_BACKGROUND_COLOR
} from '../colors';

// duplicate
const EVENT_ITEM_LOCATION_COLOR = '#808597';

const MobileInput = props => (
  <div className={`mobileInput`}>
    <div className={'mobileInput-content'} onClick={props.onClick}>
      <SearchIcon fill={EVENT_ITEM_LOCATION_COLOR} />
      <span className={'mobileInput-placeholder'}>
        {'Rechercher par ville, date, épreuve'}
      </span>
    </div>

    <style jsx>{`
      .mobileInput {
        padding: ${getSpacing('s')}px;
        padding-bottom: 0;
        background-color: ${APP_BACKGROUND_COLOR};
        transition: transform 0.3s ease-out;
        will-change: transform;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 2;
      }

      .mobileInput-content {
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        background-color: ${white};
        border-radius: ${BORDER_RADIUS}px;
        display: flex;
        align-items: center;
        box-shadow: 0 10px 20px 0 rgba(38, 74, 67, 0.05);
      }

      .mobileInput-placeholder {
        text-align: center;
        color: ${EVENT_ITEM_LOCATION_COLOR};
      }

      .in {
        transform: translateY(0);
      }

      .out {
        transform: translateY(-100%);
      }
    `}</style>
  </div>
);

export default MobileInput;
