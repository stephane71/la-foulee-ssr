import React from 'react';

import SearchIcon from '../svgs/ic_search_white_24px.svg';

import { BORDER_RADIUS } from '../enums';
import { getSpacing } from '../styles-variables';
import { getFontSize } from '../styles-variables';
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
        padding: ${getSpacing('s')}px ${getSpacing('xs')}px;
        padding-bottom: 0;
        width: 100%;
      }

      .mobileInput-content {
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        background-color: ${white};
        border-radius: ${BORDER_RADIUS}px;
        display: flex;
        align-items: center;
        box-shadow: 0 0 20px 0 rgba(38, 74, 67, .4);
      }

      .mobileInput-placeholder {
        text-align: center;
        color: ${EVENT_ITEM_LOCATION_COLOR};
        font-size: ${getFontSize('s')}px;
      }
    `}</style>
  </div>
);

export default MobileInput;
