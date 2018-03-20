import moment from 'moment';

import SVGWrapper from './SVGWrapper';

import IconLocation from '../svgs/ic_location_on_white_24px.svg';
import IconAgenda from '../svgs/ic_event_white_24px.svg';

import { SECONDARY_COLOR, white, dominant } from '../colors';
import { getSpacing } from '../styles-variables';

function formatDistance(value) {
  if (value < 1000) return `${value}m`;
  return `${value / 1000}km`;
}

// DUPLICATE
const EVENT_ITEM_TITLE_COLOR = white;
// DUPLICATE
const DATE_FORMAT = 'dddd D MMMM';

const OrgaLink = ({ href }) => (
  <a href={href} target={'_blank'}>
    {'Site organisateur'}
    <style jsx>{`
      a {
        display: block;
        color: ${white};
        background-color: ${dominant};
        width: 100%;
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        margin-bottom: ${getSpacing('m')}px;
        text-align: center;
        text-decoration: none;
        border-radius: 20px;
        border: 1px solid white;
      }
    `}</style>
  </a>
);

const EventDetails = ({ data }) => (
  <div className={'EventDetails'}>
    <header className={`EventDetails-header`}>
      <h1 className={`EventDetails-title`}>{data.title}</h1>
    </header>

    <div className={'EventDetails-informations'}>
      <h2>{'Informations'}</h2>

      <div className={'EventDetails-datum'}>
        <SVGWrapper icon={IconLocation} />
        <address className={'EventDetails-location'}>{`${data.dep}, ${
          data.city
        }`}</address>
      </div>

      <div className={'EventDetails-datum'}>
        <SVGWrapper icon={IconAgenda} />
        <div className={'EventDetails-date'}>
          {moment.unix(data.date).format(DATE_FORMAT)}
        </div>
      </div>
    </div>

    <div className={'EventDetails-activities'}>
      <h2>{'Épreuves'}</h2>
      <ul className={``}>
        {data.activities
          .sort((act1, act2) => act2.value - act1.value)
          .map(({ value, time, inscriptionFee }, i) => (
            <li key={i} className={`EventDetails-activityItem`}>
              {`${formatDistance(value)} ${time} ${inscriptionFee || 'NC'}`}
            </li>
          ))}
      </ul>
    </div>

    <div className={'EventDetails-footer'}>
      <OrgaLink href={'https://www.google.com'} />
    </div>

    <style jsx>{`
      .EventDetails {
        position: relative;
        height: 100%;
        width: 100%;
        color: ${EVENT_ITEM_TITLE_COLOR};
        background-color: ${dominant};
        padding: ${getSpacing('m')}px;
      }

      .EventDetails-header {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .EventDetails-activities {
      }

      .EventDetails-informations {
      }

      .EventDetails-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
      }

      .EventDetails-title {
        text-transform: capitalize;
        font-family: 'Circular-Medium';
        font-weight: 500;
        margin: 0;
      }

      .EventDetails-location {
        font-style: inherit;
      }

      .EventDetails-datum {
        display: flex;
        align-items: center;
      }

      .EventDetails-date {
        text-transform: capitalize;
      }
    `}</style>
  </div>
);

export default EventDetails;
