import React from 'react';
import css from 'styled-jsx/css';
import moment from 'moment';

import IconWrapper from './IconWrapper';

import IconLocation from '../svgs/baseline-location_on-24px.svg';
import IconAgenda from '../svgs/baseline-event-24px.svg';

import { getSpacing } from '../styles-variables';
import { APP_COLOR } from '../colors';
import { DATE_FORMAT } from '../enums';

IconLocation = IconWrapper(IconLocation);
IconAgenda = IconWrapper(IconAgenda);

function buildGoogleMapURL({ place_id, city }) {
  const BASE_URL = 'https://www.google.com/maps/search/?api=1';
  return `${BASE_URL}&query_place_id=${place_id}&query=${encodeURIComponent(
    city
  )}`;
}

const style = css`
  .GlobalInfo-DatumValue {
    display: inline-block;
    vertical-align: middle;
    margin-left: ${getSpacing('xs')}px;
    font-style: normal;
  }

  .GlobalInfo-Location {
    display: flex;
  }

  .GlobalInfo-Date {
    margin-bottom: ${getSpacing('s')}px;
  }

  .GlobalInfo-Date > .GlobalInfo-DatumValue {
    text-transform: capitalize;
  }

  .GlobalInfo-MapLink {
    color: ${APP_COLOR};
    text-decoration: none;
  }
`;

const EventDetailsGlobalInfo = ({ data, iconColor }) => (
  <div>
    <div className={'GlobalInfo-Date'}>
      <IconAgenda fill={iconColor} />
      <div className={'GlobalInfo-DatumValue'}>
        {moment
          .unix(data.date)
          .utc()
          .format(DATE_FORMAT)}
      </div>
    </div>

    <a
      className={'GlobalInfo-MapLink'}
      target={'_blank'}
      href={buildGoogleMapURL(data)}
    >
      <div className={'GlobalInfo-Location'}>
        <IconLocation fill={iconColor} />
        <address className={'GlobalInfo-DatumValue'}>{`${data.city}${
          data.department ? `, ${data.department.name}` : ''
        }`}</address>
      </div>
    </a>

    <style jsx>{style}</style>
  </div>
);

export default EventDetailsGlobalInfo;
