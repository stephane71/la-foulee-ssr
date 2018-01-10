// should not be added !
// when using babel-plugin-inline-react-svg (added for project) && babel-plugin-react-require (added from next.js)
// read here https://github.com/kesne/babel-plugin-inline-react-svg/issues/31#issuecomment-342264348
import React from 'react';
import Link from 'next/link';

import { getSpacing } from '../styles-variables';
import { white, listBorderColor } from '../colors';
import Arrow from '../svgs/arrow_right_black_24px.svg';

export default props => (
  <Link prefetch as={`/event/${props.data.keyword}`} href={`/event`}>
    <div
      className={`event-list-item-root ${
        props.lastItem ? `last-list-item` : ``
      }`}
    >
      <div className={`event-data`}>
        <div className={`title`}>{props.data.title}</div>
        <div className={'location'}>{`${props.data.dep}, ${
          props.data.city
        }`}</div>
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
        }
      `}</style>
    </div>
  </Link>
);
