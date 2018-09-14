import css from 'styled-jsx/css';

import EventDetailsGlobalInfo from './EventDetailsGlobalInfo';
import EventDetailsShare from './EventDetailsShare';
import EventDetailsActivities from './EventDetailsActivities';
import EventDetailsOrgaLink from './EventDetailsOrgaLink';
import StaticMap from './StaticMap';

import { getSpacing, getFontSize } from '../styles-variables';
import { getColor } from '../colors';

const ICON_COLOR = getColor('light');

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

  .EventDetails > section {
    margin-bottom: ${getSpacing('m')}px;
  }

  .EventDetails-Header {
    margin-bottom: ${getSpacing('m')}px;
  }

  .EventDetails-Title {
    text-transform: capitalize;
    font-family: 'Circular-Medium';
    font-weight: 500;
    margin: 0;
  }

  .EventDetails-Subtitle {
    font-size: ${getFontSize('l')}px;
    margin: 0;
  }
`;

const EventDetails = ({ data, desktop, isServer, onClickOrgaLink }) => (
  <article className={'EventDetails'}>
    <header className={`EventDetails-Header`}>
      <h1 className={`EventDetails-Title`}>{data.title}</h1>
    </header>

    <div className={'EventDetails-GlobalInfo'}>
      <EventDetailsGlobalInfo
        data={data}
        desktop={desktop}
        isServer={isServer}
        iconColor={ICON_COLOR}
      />
    </div>

    <div className={'EventDetails-StaticMap'}>
      <StaticMap
        event={data}
        desktop={desktop}
        color={ICON_COLOR}
        isServer={isServer}
      />
    </div>

    <section className={'EventDetails-ShareEvent'}>
      <EventDetailsShare
        data={data}
        desktop={desktop}
        isServer={isServer}
        iconColor={ICON_COLOR}
      />
    </section>

    <section className={'EventDetails-Activities'}>
      <h2 className={'EventDetails-Subtitle'}>{'Épreuves'}</h2>
      {data.activities && data.activities.length ? (
        <EventDetailsActivities data={data} />
      ) : (
        <div>{`Aucune épreuve n'a été transmise par l'organisateur`}</div>
      )}
    </section>

    <footer>
      <EventDetailsOrgaLink
        data={data}
        desktop={desktop}
        onClickOrgaLink={onClickOrgaLink}
      />
    </footer>

    <style jsx>{style}</style>
  </article>
);

export default EventDetails;
