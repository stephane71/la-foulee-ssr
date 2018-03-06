import { SECONDARY_COLOR, white, dominant } from '../colors';
import { getSpacing, getFontSize } from '../styles-variables';

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
  <div className={'eventDetails'}>
    <header className={`eventDetails-header`}>
      <h6 className={`eventDetails-title`}>{data.title}</h6>
      <address className={'eventDetails-location'}>{`${data.dep}, ${
        data.city
      }`}</address>
    </header>

    <h6>{'Épreuves'}</h6>
    <ul className={`eventDetails-activities`}>
      {data.activities
        .sort((act1, act2) => act2.value - act1.value)
        .map(({ value, time, inscriptionFee }, i) => (
          <li key={i} className={`eventDetails-activityItem`}>
            {`${formatDistance(value)} ${time} ${inscriptionFee || 'NC'}`}
          </li>
        ))}
    </ul>
    <OrgaLink href={'https://www.google.com'} />

    <style jsx>{`
      .eventDetails {
        width: 100%;
        color: ${EVENT_ITEM_TITLE_COLOR};
      }

      .eventDetails-header {
        max-width: calc(100% - 24px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .eventDetails-title {
        text-transform: capitalize;
        font-family: 'Circular-Medium';
        font-weight: 500;
        margin: 0;
      }

      .eventDetails-location {
        color: ${SECONDARY_COLOR};
        font-weight: 400;
        font-size: ${getFontSize('s')}px;
        font-style: normal;
      }

      .eventDetails-activities {
      }

      .eventDetails-activityItem {
      }
    `}</style>
  </div>
);

export default EventDetails;
