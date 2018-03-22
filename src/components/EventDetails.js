import moment from 'moment';

import IconLocation from '../svgs/ic_location_on_white_24px.svg';
import IconAgenda from '../svgs/ic_event_white_24px.svg';

import { textColorTonic, subtitleColorTonic, dominant } from '../colors';
import { getSpacing, getFontSize } from '../styles-variables';
import { BORDER_RADIUS } from '../enums';

function formatDistance(value) {
  if (value < 1000) return `${value}m`;
  return `${value / 1000}km`;
}

const ICON_COLOR = '#8FB0A9';

// DUPLICATE
const DATE_FORMAT = 'dddd D MMMM';

const OrgaLink = ({ href }) => (
  <a href={href} target={'_blank'}>
    {'Site organisateur'}
    <style jsx>{`
      a {
        display: inline-block;
        color: ${textColorTonic};
        background-color: ${dominant};
        padding: ${getSpacing('xs')}px ${getSpacing('m')}px;
        text-align: center;
        text-decoration: none;
        border-radius: ${BORDER_RADIUS * 5}px;
        border: 1px solid white;
      }
    `}</style>
  </a>
);

const EventDetails = ({ data }) => (
  <div className={'EventDetails'}>
    <header className={`EventDetails-Header`}>
      <h1 className={`EventDetails-Title`}>{data.title}</h1>
    </header>

    <div className={'EventDetails-Informations'}>
      <h2 className={'EventDetails-Subtitle'}>{'Informations'}</h2>

      <div className={'EventDetails-Datum'}>
        <IconLocation style={{ fill: ICON_COLOR, verticalAlign: 'middle' }} />
        <address
          className={'EventDetails-Location EventDetails-DatumLabel'}
        >{`${data.dep}, ${data.city}`}</address>
      </div>

      <div className={'EventDetails-Datum'}>
        <IconAgenda style={{ fill: ICON_COLOR, verticalAlign: 'middle' }} />
        <div className={'EventDetails-Date EventDetails-DatumLabel'}>
          {moment.unix(data.date).format(DATE_FORMAT)}
        </div>
      </div>
    </div>

    <div className={'EventDetails-Activities'}>
      <h2 className={'EventDetails-Subtitle'}>{'Épreuves'}</h2>
      <ul>
        {data.activities
          .sort((act1, act2) => act2.value - act1.value)
          .map(({ value, time, inscriptionFee }, i) => (
            <li key={i}>
              {`${formatDistance(value)} ${time} ${inscriptionFee || 'NC'}`}
            </li>
          ))}
      </ul>
    </div>

    <div className={'EventDetails-Footer'}>
      <OrgaLink
        target={`_blank`}
        href={`https://www.google.com/search?q=${data.title}+${data.dep}+${
          data.city
        }+${moment.unix(data.date).format(DATE_FORMAT)}&num=1`}
      />
    </div>

    <style jsx>{`
      .EventDetails {
        position: relative;
        width: 100%;
        color: ${textColorTonic};
        background-color: ${dominant};
        padding: ${getSpacing('m')}px;
        border-radius: ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0 0;
        flex: 1;
      }

      .EventDetails-Header {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .EventDetails-Informations {
      }

      .EventDetails-Activities {
      }

      .EventDetails-Footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: ${getSpacing('m')}px;
      }

      .EventDetails-Title {
        text-transform: capitalize;
        font-family: 'Circular-Medium';
        font-weight: 500;
        margin: 0;
      }

      .EventDetails-Subtitle {
        font-weight: 400;
        font-size: ${getFontSize('l')}px;
        color: ${subtitleColorTonic};
      }

      .EventDetails-Location {
        font-style: inherit;
      }

      .EventDetails-Datum {
        margin-bottom: ${getSpacing('s')}px;
      }

      .EventDetails-DatumLabel {
        margin-left: ${getSpacing('s')}px;
        display: inline-block;
        vertical-align: middle;
      }

      .EventDetails-Date {
        text-transform: capitalize;
      }
    `}</style>
  </div>
);

export default EventDetails;
