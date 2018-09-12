import css from 'styled-jsx/css';
import getConfig from 'next/config';
import moment from 'moment';

import IconWrapper from './IconWrapper';

import IconLocation from '../svgs/outline-location_on-24px.svg';
import IconAgenda from '../svgs/outline-event-24px.svg';

import { getSpacing } from '../styles-variables';
import { APP_COLOR, APP_BACKGROUND_COLOR } from '../colors';
import { DATE_FORMAT, BORDER_RADIUS } from '../enums';

IconLocation = IconWrapper(IconLocation);
IconAgenda = IconWrapper(IconAgenda);

function buildGoogleMapURL({ place_id, city }) {
  const BASE_URL = 'https://www.google.com/maps/search/?api=1';
  return `${BASE_URL}&query_place_id=${place_id}&query=${encodeURIComponent(
    city
  )}`;
}

function buildGoogleMapStaticImage({ city, department }, desktop) {
  const mobileSize = '300x100';
  const desktopSize = '600x200';

  const BASE_URL = `https://maps.googleapis.com/maps/api/staticmap?size=${
    desktop ? desktopSize : mobileSize
  }&zoom=11&key=${GOOGLE_PLACES_API_KEY}`;
  return `${BASE_URL}&center=${encodeURIComponent(city)},${department.isoCode}`;
}

const { publicRuntimeConfig } = getConfig();
const GOOGLE_PLACES_API_KEY = publicRuntimeConfig.GOOGLE_PLACES_API_KEY;

const ICON_COLOR = '#B7C9C6';

const style = css`
  .EventDetails-Datum {
    margin-bottom: ${getSpacing('s')}px;
  }

  .EventDetails-DatumValue {
    display: inline-block;
    vertical-align: middle;
    margin-left: ${getSpacing('xs')}px;
    font-style: normal;
  }

  .EventDetails-DatumLocation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .EventDetails-DatumLocationMain {
    color: ${APP_COLOR};
    display: flex;
  }

  .EventDetails-DatumDate > .EventDetails-DatumValue {
    text-transform: capitalize;
  }

  .EventDetails-DatumMap {
    border-radius: ${BORDER_RADIUS}px;
    border: 1px solid ${ICON_COLOR};
  }
`;

const EventDetailsGlobalInfo = ({ data, desktop, isServer }) => (
  <div>
    <div className={'EventDetails-Datum EventDetails-DatumDate'}>
      <IconAgenda fill={ICON_COLOR} />
      <div className={'EventDetails-DatumValue'}>
        {moment
          .unix(data.date)
          .utc()
          .format(DATE_FORMAT)}
      </div>
    </div>

    <a target={'_blank'} href={buildGoogleMapURL(data)}>
      <div className={'EventDetails-Datum EventDetails-DatumLocation'}>
        <div className={'EventDetails-DatumLocationMain'}>
          <div>
            <IconLocation fill={ICON_COLOR} />
          </div>
          <div>
            <address className={'EventDetails-DatumValue'}>{`${data.city}, ${
              data.department.name
            }`}</address>
          </div>
        </div>
      </div>
      <div>
        {!isServer && (
          <img
            className={'EventDetails-DatumMap'}
            src={buildGoogleMapStaticImage(data, desktop)}
            width={'100%'}
          />
        )}
      </div>
    </a>

    <style jsx>{style}</style>
  </div>
);

export default EventDetailsGlobalInfo;
