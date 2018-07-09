import moment from 'moment';
import css from 'styled-jsx/css';

import IconLocation from '../svgs/ic_location_on_white_24px.svg';
import IconAgenda from '../svgs/ic_event_white_24px.svg';

import { getSpacing, getFontSize } from '../styles-variables';
import { MAX_WIDTH, DATE_FORMAT, BORDER_RADIUS } from '../enums';
import { dominant } from '../colors';

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
    white-space: pre;
  }

  .EventDetails-DatumLocation > .EventDetails-DatumValue {
    font-style: inherit;
  }

  .EventDetails-DatumDate > .EventDetails-DatumValue {
    text-transform: capitalize;
  }

  .EventDetails-Subtitle {
    font-weight: 400;
    font-size: ${getFontSize('l')}px;
  }

  @media (max-width: ${MAX_WIDTH}px) {
    .EventDetails-Footer {
      bottom: 0;
    }
  }
`;

const EventDetails = ({ data, desktop, isServer, onClickOrgaLink }) => (
  <div className={'EventDetails'}>
    {/* HEADER */}
    <header className={`EventDetails-Header`}>
      <h1 className={`EventDetails-Title`}>{data.title}</h1>
    </header>

    {/* DESCRIPTION */}
    {data.info && <div className={'EventDetails-Description'}>{data.info}</div>}

    {/* GLOBAL INFO */}
    <div>
      <div className={'EventDetails-Datum EventDetails-DatumLocation'}>
        <IconLocation style={{ fill: ICON_COLOR, verticalAlign: 'middle' }} />
        <address className={'EventDetails-DatumValue'}>{`${data.city}\n${
          data.department.code
        }, ${data.department.name}`}</address>
      </div>

      <div className={'EventDetails-Datum EventDetails-DatumDate'}>
        <IconAgenda style={{ fill: ICON_COLOR, verticalAlign: 'middle' }} />
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

    {/* ACTIVITIES */}
    <div>
      <h2 className={'EventDetails-Subtitle'}>{'Épreuves'}</h2>
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
              .map(({ distance, time, inscriptionFee, title }, i) => (
                <tr className={'Table-Row'} key={i}>
                  <td className={'Table-DataCell Table-DataCell--bold'}>
                    {formatDistance(distance) || title || EMPTY_VALUE}
                  </td>
                  <td className={'Table-DataCell'}>{time || EMPTY_VALUE}</td>
                  <td className={'Table-DataCell'}>
                    {inscriptionFee || EMPTY_VALUE}
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
          className={'Button Button--fixed'}
        >{`Site de l'organisateur`}</a>
      </footer>
    )}

    <style jsx>{style}</style>
  </div>
);

export default EventDetails;
