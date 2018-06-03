import moment from 'moment';
import css from 'styled-jsx/css';

import IconLocation from '../svgs/ic_location_on_white_24px.svg';
import IconAgenda from '../svgs/ic_event_white_24px.svg';

import { getSpacing, getFontSize } from '../styles-variables';
import { MAX_WIDTH, DATE_FORMAT, BORDER_RADIUS } from '../enums';
import { dominant } from '../colors';

function formatDistance(value) {
  if (value < 1000) return `${value}m`;
  return `${value / 1000}km`;
}

const EVENT_COLOR = '#ebfefa';
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
  }

  .Event-Wrapper {
    color: ${EVENT_COLOR};
    background: ${dominant} url(/static/details-background.svg) bottom center
      no-repeat;
    border-radius: ${BORDER_RADIUS}px;
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

  .Event-Title {
    text-transform: capitalize;
    font-family: 'Circular-Medium';
    font-weight: 500;
    margin: 0;
  }

  .Event-Footer {
    margin-top: auto;
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
`;

const Event = ({ data }) => (
  <div className={'Event Event-Wrapper'}>
    {/* HEADER */}
    <header className={`Event-Header`}>
      <h1 className={`Event-Title`}>{data.title}</h1>
    </header>

    {/* DESCRIPTION */}
    {data.info && <div>{data.info}</div>}

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
          {moment.unix(data.date).format(DATE_FORMAT)}
        </div>
      </div>
    </div>

    {/* ACTIVITIES */}
    <div>
      <h2 className={'Event-Subtitle'}>{'Épreuves'}</h2>

      <table className={'Table'}>
        <thead className={'Table-Head'}>
          <tr className={'Table-Row'}>
            <th className={'Table-DataHeader'} />
            <th className={'Table-DataHeader'}>{`Départ`}</th>
            <th className={'Table-DataHeader'}>{`Prix`}</th>
          </tr>
        </thead>
        <tbody className={'Table-Body'}>
          {data.activities &&
            data.activities
              .sort((act1, act2) => act2.value - act1.value)
              .map(({ distance, time, inscriptionFee }, i) => (
                <tr className={'Table-Row'} key={i}>
                  <td className={'Table-DataCell Table-DataCell--bold'}>
                    {formatDistance(distance)}
                  </td>
                  <td className={'Table-DataCell'}>{time || 'NC'}</td>
                  <td className={'Table-DataCell'}>{inscriptionFee || 'NC'}</td>
                </tr>
              ))}
        </tbody>
      </table>

      {!data.activities && (
        <div>{`Aucune épreuve n'a été transmise par l'organisateur`}</div>
      )}
    </div>

    {/* FOOTER */}
    <footer className={'Event-Footer'}>
      {`Call to Actions: Partage / Ajout Calendrier / Site le d'organisateur`}
    </footer>

    <style jsx>{style}</style>
  </div>
);

export default Event;
