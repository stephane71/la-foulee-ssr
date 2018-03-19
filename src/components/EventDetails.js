import { SECONDARY_COLOR, white, dominant } from '../colors';
import { getSpacing, getFontSize } from '../styles-variables';
import { BORDER_RADIUS } from '../enums';

function formatDistance(value) {
  if (value < 1000) return `${value}m`;
  return `${value / 1000}km`;
}

// DUPLICATE
const EVENT_ITEM_TITLE_COLOR = white;

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
      <h6 className={`EventDetails-title`}>{data.title}</h6>
      <address className={'EventDetails-location'}>{`${data.dep}, ${
        data.city
      }`}</address>
    </header>

    <h6>{'Épreuves'}</h6>
    <ul className={`EventDetails-activities`}>
      {data.activities
        .sort((act1, act2) => act2.value - act1.value)
        .map(({ value, time, inscriptionFee }, i) => (
          <li key={i} className={`EventDetails-activityItem`}>
            {`${formatDistance(value)} ${time} ${inscriptionFee || 'NC'}`}
          </li>
        ))}
    </ul>
    <OrgaLink href={'https://www.google.com'} />

    <style jsx>{`
      .EventDetails {
        height: 100%;
        width: 100%;
        color: ${EVENT_ITEM_TITLE_COLOR};
        background-color: ${dominant};
        padding: ${getSpacing('s')}px;
        border-radius: ${BORDER_RADIUS}px;
      }

      .EventDetails-header {
        max-width: calc(100% - 24px);
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .EventDetails-title {
        text-transform: capitalize;
        font-family: 'Circular-Medium';
        font-weight: 500;
        margin: 0;
      }

      .EventDetails-location {
        color: ${SECONDARY_COLOR};
        font-weight: 400;
        font-size: ${getFontSize('s')}px;
        font-style: normal;
      }

      .EventDetails-activities {
      }

      .EventDetails-activityItem {
      }
    `}</style>
  </div>
);

export default EventDetails;
