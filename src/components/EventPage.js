import React from 'react';
import moment from 'moment';

import A from './A';
import Agenda from '../svgs/ic_event_white_24px.svg';
import Location from '../svgs/ic_location_on_white_24px.svg';
import Flag from '../svgs/ic_flag_white_24px.svg';
import AccessTime from '../svgs/ic_access_time_black_24px.svg';
import EurosSymbol from '../svgs/ic_euro_symbol_black_24px.svg';
import Email from '../svgs/ic_email_black_24px.svg';
import Smartphone from '../svgs/ic_smartphone_black_24px.svg';

import { getSpacing, H6 } from '../styles-variables';
import { getColor, dominant } from '../colors';

function formatDistance(value) {
  if (value < 1000) return `${value}m`;
  return `${value / 1000}km`;
}

const DATE_FORMAT = 'dddd D MMMM';
const FONT_WEIGHT_SEMI_BOLD = 600;

const EventDatum = ({ Icon, datum, pushRight, children }) => (
  <div className={'event-datum-block'}>
    <Icon
      fill={getColor('darkGrey', 'tonic')}
      style={{ marginRight: `${getSpacing('s')}px` }}
    />
    {children}
    <style jsx>{`
      .event-datum-block {
        display: flex;
        flex: 1;
        justify-content: ${pushRight ? 'flex-end' : 'flex-start'};
        padding-bottom: ${getSpacing('s')}px;
      }
    `}</style>
  </div>
);

const EventPage = ({ data }) => (
  <div className={'event-root'}>
    <h1 className={'event-title circular-bold'}>{data.title}</h1>
    <A href={'https://www.google.com'} style={{ textTransform: 'uppercase' }}>
      {'Site organisateur'}
    </A>
    <EventDatum Icon={Agenda}>
      <span className={'event-date'}>
        {moment.unix(data.date).format(DATE_FORMAT)}
      </span>
    </EventDatum>
    <EventDatum Icon={Location}>{`${data.dep} - ${data.city}`}</EventDatum>

    <h2>{`Épreuves`}</h2>
    <ul>
      {data.activities
        .sort((act1, act2) => act2.value - act1.value)
        .map(({ value, time, inscriptionFee }, i) => (
          <li
            key={i}
            className={`event-activity ${i < data.activities.length - 1 &&
              'event-activity-borderBottom'}`}
          >
            <div className={'event-activity-distance'}>
              {formatDistance(value)}
            </div>
            <div className={'event-activity-details'}>
              <EventDatum Icon={AccessTime}>
                {`Départ à${String.fromCharCode(160)}`}
                <span className={'event-activity-datum'}>{`${time}`}</span>
              </EventDatum>
              <EventDatum Icon={EurosSymbol} pushRight>
                {`Prix${String.fromCharCode(160)}`}
                <span className={'event-activity-datum'}>{`${
                  inscriptionFee ? `de ${inscriptionFee}` : 'NC'
                }`}</span>
              </EventDatum>
            </div>
          </li>
        ))}
    </ul>

    <style jsx>{`
      h1,
      h2 {
        color: ${dominant};
      }

      .event-root {
        max-width: 720px;
        min-height: calc(100% - ${getSpacing('m')}px);
        padding: ${getSpacing('m')}px;
        padding-top: 0;
        padding-bottom: ${getSpacing('m')}px;
      }

      .event-title {
        margin-bottom: ${getSpacing('m')}px;
        text-transform: capitalize;
      }

      .event-date {
        text-transform: capitalize;
      }

      ul {
        list-style: none;
        padding-left: 0;
        margin-bottom: ${getSpacing('m')}px;
      }

      .event-activity {
        display: flex;
        flex-direction: column;
        margin-bottom: ${getSpacing('s')}px;
      }

      .event-activity-borderBottom {
        border-bottom: 1px solid ${getColor('lightGrey', 'tonic')};
      }

      .event-activity-distance {
        font-size: ${H6.fontSize}px;
        font-weight: 500;
      }

      .event-activity-details {
        display: flex;
        padding-top: ${getSpacing('s')}px;
        color: ${getColor('darkGrey', 'tonic')};
      }

      .event-activity-datum {
        font-weight: ${FONT_WEIGHT_SEMI_BOLD};
      }
    `}</style>
  </div>
);

export default EventPage;
