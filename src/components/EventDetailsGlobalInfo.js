import css from 'styled-jsx/css';
import moment from 'moment';

import IconWrapper from './IconWrapper';

import IconLocation from '../svgs/outline-location_on-24px.svg';
import IconAgenda from '../svgs/outline-event-24px.svg';

import { getSpacing } from '../styles-variables';
import { APP_COLOR, APP_BACKGROUND_COLOR } from '../colors';
import { DATE_FORMAT } from '../enums';

IconLocation = IconWrapper(IconLocation);
IconAgenda = IconWrapper(IconAgenda);

function buildGoogleMapURL({ place_id, city }) {
  const BASE_URL = 'https://www.google.com/maps/search/?api=1';
  return `${BASE_URL}&query_place_id=${place_id}&query=${encodeURIComponent(
    city
  )}`;
}

const ICON_COLOR = '#B7C9C6';

const style = css`
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
`;

const EventDetailsGlobalInfo = ({ data }) => (
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

    <style jsx>{style}</style>
  </div>
);

export default EventDetailsGlobalInfo;
