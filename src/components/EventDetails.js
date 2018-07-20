import moment from 'moment';
import css from 'styled-jsx/css';
import getConfig from 'next/config';

import IconWrapper from './IconWrapper';
import Share from './Share';
import Button from './Button';

import IconLocation from '../svgs/outline-location_on-24px.svg';
import IconAgenda from '../svgs/outline-event-24px.svg';

import { APP_COLOR, APP_BACKGROUND_COLOR } from '../colors';
import { getSpacing, getFontSize } from '../styles-variables';
import {
  MAX_WIDTH,
  DATE_FORMAT,
  FACEBOOK_SHARE,
  TWITTER_SHARE
} from '../enums';

IconLocation = IconWrapper(IconLocation);
IconAgenda = IconWrapper(IconAgenda);

function formatDistance(value) {
  if (!value) return value;
  if (value < 1000) return `${value}m`;
  return `${value / 1000}km`;
}

function getOrgaLink({ keyword, webSite = [], date }) {
  if (webSite.length) return webSite[0];
  return `https://www.google.com/search?q=${keyword.replace(
    /\-/g,
    '+'
  )} ${moment.unix(date).year()}`;
}

// function buildGoogleMapStaticImage({ city, department }, desktop) {
//   const mobileSize = '300x100';
//   const desktopSize = '600x200';
//   const BASE_URL = `https://maps.googleapis.com/maps/api/staticmap?size=${
//     desktop ? desktopSize : mobileSize
//   }&zoom=11&key=${GOOGLE_PLACES_API_KEY}`;
//   return `${BASE_URL}&center=${encodeURIComponent(city)},${department.isoCode}`;
// }

function buildGoogleMapURL({ place_id, city }) {
  const BASE_URL = 'https://www.google.com/maps/search/?api=1';
  return `${BASE_URL}&query_place_id=${place_id}&query=${encodeURIComponent(
    city
  )}`;
}

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;
// const GOOGLE_PLACES_API_KEY = publicRuntimeConfig.GOOGLE_PLACES_API_KEY;

const ICON_COLOR = '#B7C9C6';
const EMPTY_VALUE = '-';

const style = css`
  .EventDetails {
    position: relative;
    width: 100%;
    height: 100%;
    padding: ${getSpacing('m')}px;
    padding-bottom: ${getSpacing('xl')}px;
    display: flex;
    flex-direction: column;
  }

  .EventDetails > div {
    margin-bottom: ${getSpacing('m')}px;
  }

  .EventDetails-Header {
    margin-bottom: ${getSpacing('m')}px;
  }

  .EventDetails-Description {
    white-space: pre-line;
  }

  .EventDetails-Title {
    text-transform: capitalize;
    font-family: 'Circular-Medium';
    font-weight: 500;
    margin: 0;
  }

  .EventDetails-Footer--mobile {
    margin: 0 auto;
    position: fixed;
    bottom: ${getSpacing('m')}px;
    max-width: 100%;
    width: 768px;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
  }

  .EventDetails-Footer--desktop {
    margin: auto auto 0;
  }

  .EventDetails-Footer {
    padding: ${getSpacing('m')}px;
  }

  .EventDetails-Datum {
    margin-bottom: ${getSpacing('s')}px;
  }

  .EventDetails-DatumValue {
    display: inline-block;
    vertical-align: middle;
    margin-left: ${getSpacing('xs')}px;
  }

  .EventDetails-DatumLocation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .EventDetails-DatumLocation:hover {
    background-color: ${APP_BACKGROUND_COLOR};
  }

  .EventDetails-DatumLocationMain {
    white-space: pre;
    color: ${APP_COLOR};
  }

  .EventDetails-DatumLocationMain > .EventDetails-DatumValue {
    font-style: inherit;
  }

  .EventDetails-DatumLocationAction {
    color: ${APP_COLOR};
    text-decoration-color: ${APP_COLOR};
  }

  .EventDetails-DatumLocationExtraText {
    padding-right: ${getSpacing('xs')}px;
  }

  .EventDetails-DatumDate > .EventDetails-DatumValue {
    text-transform: capitalize;
  }

  .EventDetails-Subtitle {
    font-weight: 400;
    font-size: ${getFontSize('l')}px;
    margin: 0;
  }

  .EventDetails-Share {
    padding: ${getSpacing('s')}px 0;
    display: flex;
    flex-direction: row;
  }

  @media (max-width: ${MAX_WIDTH}px) {
    .EventDetails-Footer {
      bottom: 0;
    }
  }
`;

const EventDetails = ({ data, desktop, isServer, onClickOrgaLink, path }) => (
  <div className={'EventDetails'}>
    {/* HEADER */}
    <header className={`EventDetails-Header`}>
      <h1 className={`EventDetails-Title`}>{data.title}</h1>
    </header>

    {/* GLOBAL INFO */}
    <div>
      <a
        target={'_blank'}
        href={buildGoogleMapURL(data)}
        className={'EventDetails-DatumLocationAction'}
      >
        <div className={'EventDetails-Datum EventDetails-DatumLocation'}>
          <div className={'EventDetails-DatumLocationMain'}>
            <IconLocation fill={ICON_COLOR} />
            <address className={'EventDetails-DatumValue'}>{`${data.city}\n${
              data.department.code
            }, ${data.department.name}`}</address>
          </div>
          <div className={'EventDetails-DatumLocationExtraText'}>{'carte'}</div>
        </div>
      </a>

      <div className={'EventDetails-Datum EventDetails-DatumDate'}>
        <IconAgenda fill={ICON_COLOR} />
        <div className={'EventDetails-DatumValue'}>
          {moment
            .unix(data.date)
            // WARNING: lazy fix to not have to deal with utc offset
            // The server may have a utc offset of 0 => moment display the day before in ssr
            // To see it add {moment().utcOffset()}
            .add(12, 'hours')
            .format(DATE_FORMAT)}
        </div>
      </div>
    </div>

    {/* SHARE */}
    <h2 className={'EventDetails-Subtitle'}>{'Partager cet événement'}</h2>

    <div className={'EventDetails-Share'}>
      <Share dest={FACEBOOK_SHARE} url={`${APP_URL}${path}`} margin={false} />
      <Share dest={TWITTER_SHARE} url={`${APP_URL}${path}`} />
      <Button
        theme={'light'}
        size={'s'}
        marginLeft
        target={`${APP_URL}${path}`}
      >
        {'Copier le lien'}
      </Button>
    </div>

    {/* DESCRIPTION */}
    {data.info && <div className={'EventDetails-Description'}>{data.info}</div>}

    {/* ACTIVITIES */}
    <div>
      {/* <h2 className={'EventDetails-Subtitle'}>{'Épreuves'}</h2> */}
      {data.activities && data.activities.length ? (
        <table className={'Table'}>
          <thead className={'Table-Head'}>
            <tr className={'Table-Row'}>
              <th className={'Table-DataHeader'} />
              <th className={'Table-DataHeader'}>{`Départ`}</th>
              <th className={'Table-DataHeader'}>{`Prix`}</th>
            </tr>
          </thead>
          <tbody className={'Table-Body'}>
            {data.activities
              .sort((act1, act2) => act2.distance - act1.distance)
              .map(({ distance, time, price, title }, i) => (
                <tr className={'Table-Row'} key={i}>
                  <td className={'Table-DataCell Table-DataCell--bold'}>
                    {formatDistance(distance) || EMPTY_VALUE}
                  </td>
                  <td className={'Table-DataCell'}>{time || EMPTY_VALUE}</td>
                  <td className={'Table-DataCell'}>
                    {price ? `${price}€` : EMPTY_VALUE}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div>{`Aucune épreuve n'a été transmise par l'organisateur`}</div>
      )}
    </div>

    {/* FOOTER */}
    {!isServer && (
      <footer
        className={`EventDetails-Footer ${
          desktop
            ? 'EventDetails-Footer--desktop'
            : 'EventDetails-Footer--mobile'
        }`}
      >
        <a
          onClick={() => onClickOrgaLink(data.keyword)}
          href={getOrgaLink(data)}
          target={'_blank'}
          className={
            'Button Button--fixed Button-Theme--dominant Button-Size--m'
          }
        >{`Site de l'organisateur`}</a>
      </footer>
    )}

    <style jsx>{style}</style>
  </div>
);

export default EventDetails;
