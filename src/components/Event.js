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

const ICON_COLOR = '#B7C9C6';

const style = css`
  .Event {
    position: relative;
    width: 100%;
    max-width: ${MAX_WIDTH}px;
    min-height: 100%;
    padding: ${getSpacing('m')}px;
    display: flex;
    flex-direction: column;
    padding-bottom: ${getSpacing('xl')}px
  }

  .Event-Wrapper {
    flex: 1;
    background-size: 100%;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
  }

  .Event > div {
    margin-bottom: ${getSpacing('m')}px;
  }

  .Event-Header {
    margin-bottom: ${getSpacing('m')}px;
  }

  .Event-Description {
    white-space: pre-line;
  }

  .Event-Title {
    text-transform: capitalize;
    font-family: 'Circular-Medium';
    font-weight: 500;
    margin: 0;
  }

  .Event-Footer {
    margin: 0 auto;
    padding: ${getSpacing('m')}px;
    position: fixed;
    bottom: ${getSpacing('m')}px;
    max-width: 100%;
    width: 768px;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
  }

  .Event-Datum {
    margin-bottom: ${getSpacing('s')}px;
  }

  .Event-DatumValue {
    display: inline-block;
    vertical-align: middle;
    margin-left: ${getSpacing('xs')}px;
  }

  .Event-DatumLocation {
    font-style: inherit;
  }

  .Event-DatumDate {
    text-transform: capitalize;
  }

  .Event-Subtitle {
    font-weight: 400;
    font-size: ${getFontSize('l')}px;
  }

  .Button {
    background: #264a43;
    color: #f4f5f7;
    text-transform: uppercase;
    font-size: ${getFontSize('s')}px;
    padding: ${getSpacing('s')}px ${getSpacing('m')}px;
    text-decoration: none;
    border-radius 24px;
  }

  .Button--fixed {
    box-shadow: 0 10px 20px 0 rgba(38,74,67,0.05);
  }

  @media (max-width: ${MAX_WIDTH}px) {
    .Event-Footer {
      bottom: 0;
    }
  }
`;

const EMPTY_VALUE = '-';

const Event = ({ data }) => (
  <div className={'Event Event-Wrapper'}>
    {/* HEADER */}
    <header className={`Event-Header`}>
      <h1 className={`Event-Title`}>{data.title}</h1>
    </header>

    {/* DESCRIPTION */}
    {data.info && <div className={'Event-Description'}>{data.info}</div>}

    {/* GLOBAL INFO */}
    <div>
      <div className={'Event-Datum'}>
        <IconLocation style={{ fill: ICON_COLOR, verticalAlign: 'middle' }} />
        <address className={'Event-DatumValue Event-DatumLocation'}>{`${
          data.department.name
        }, ${data.city}`}</address>
      </div>

      <div className={'Event-Datum'}>
        <IconAgenda style={{ fill: ICON_COLOR, verticalAlign: 'middle' }} />
        <div className={'Event-DatumValue Event-DatumDate'}>
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
      <h2 className={'Event-Subtitle'}>{'Épreuves'}</h2>
      {data.activities.length ? (
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
    <footer className={'Event-Footer'}>
      <a
        href=""
        className={'Button Button--fixed'}
      >{`Site de l'organisateur`}</a>
    </footer>

    <style jsx>{style}</style>
  </div>
);

export default Event;
