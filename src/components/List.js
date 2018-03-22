import React from 'react';

import CheckIcon from '../svgs/ic_check_black_24px.svg';

import { APP_BACKGROUND_COLOR, SECONDARY_COLOR } from '../colors';
import { getSpacing } from '../styles-variables';

const POWERED_BY_GOOGLE_LOGO_WIDTH = 144;
const POWERED_BY_GOOGLE_LOGO_HEIGHT = 18;

const List = ({ list, onClick, poweredByGoogle }) => (
  <ul>
    {list.map((data, i) => (
      <li
        key={i}
        className={'ListItem-container'}
        onClick={() => onClick(data)}
      >
        <div className={`ListItem ${data.check ? 'ListItem-selected' : ''}`}>
          {data.matched ? (
            <div>
              {data.value.slice(0, data.matched.offset)}
              <span className={'ListItem-matched'}>
                {data.value.slice(data.matched.offset, data.matched.length)}
              </span>
              {data.value.slice(data.matched.length)}
            </div>
          ) : (
            <span>{data.value}</span>
          )}
          {data.check && <CheckIcon style={{ fill: SECONDARY_COLOR }} />}
        </div>
      </li>
    ))}
    <li className={'ListItem-container ListItem-container--googleLogo'}>
      <img
        className={'ListItem-googleLogo'}
        src={'/static/powered_by_google.png'}
      />
    </li>
    <style jsx>{`
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .ListItem-container {
        padding: ${getSpacing('s')}px;
        border-top: 1px solid ${APP_BACKGROUND_COLOR};
        text-transform: capitalize;
      }

      .ListItem-container--googleLogo {
        padding: ${getSpacing('xxs')}px;
        padding-left: ${getSpacing('s')}px;
        display: ${list.length && poweredByGoogle ? 'list-item' : 'none'};
      }

      .ListItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: ${SECONDARY_COLOR};
      }

      .ListItem-selected,
      .ListItem-matched {
        font-weight: bold;
      }

      .ListItem-googleLogo {
        width: ${POWERED_BY_GOOGLE_LOGO_WIDTH}px;
        heigth: ${POWERED_BY_GOOGLE_LOGO_HEIGHT}px;
        vertical-align: middle;
      }
    `}</style>
  </ul>
);

export default List;
