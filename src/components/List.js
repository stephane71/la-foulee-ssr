import React from 'react';

import CheckIcon from '../svgs/ic_check_black_24px.svg';

import { APP_BACKGROUND_COLOR, SECONDARY_COLOR } from '../colors';
import { getSpacing } from '../styles-variables';

const List = ({ list, onClick }) => (
  <ul>
    {list.map((data, i) => (
      <li key={i} onClick={() => onClick(data)}>
        <div className={`listItem${data.check ? ' listItem-selected' : ''}`}>
          {data.matched ? (
            <div>
              {data.value.slice(0, data.matched.offset)}
              <span className={'listItem-matched'}>
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
    <style jsx>{`
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      li {
        padding: ${getSpacing('s')}px;
        border-top: 1px solid ${APP_BACKGROUND_COLOR};
        text-transform: capitalize;
      }

      .listItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: ${SECONDARY_COLOR};
      }

      .listItem-selected,
      .listItem-matched {
        font-weight: bold;
      }
    `}</style>
  </ul>
);

export default List;
