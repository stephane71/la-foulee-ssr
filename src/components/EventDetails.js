import css from 'styled-jsx/css';

import EventDetailsGlobalInfo from './EventDetailsGlobalInfo';
import EventDetailsShare from './EventDetailsShare';
import EventDetailsActivities from './EventDetailsActivities';
import EventDetailsFooter from './EventDetailsFooter';

import { getSpacing, getFontSize } from '../styles-variables';

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

  .EventDetails-Subtitle {
    font-weight: 400;
    font-size: ${getFontSize('l')}px;
    margin: 0;
  }
`;

const EventDetails = ({ data, desktop, isServer, onClickOrgaLink, path }) => (
  <div className={'EventDetails'}>
    {/* HEADER */}
    <header className={`EventDetails-Header`}>
      <h1 className={`EventDetails-Title`}>{data.title}</h1>
    </header>

    {/* GLOBAL INFO */}
    <div className={'EventDetails-Info'}>
      <EventDetailsGlobalInfo
        data={data}
        desktop={desktop}
        isServer={isServer}
      />
    </div>

    {/* SHARE */}
    <div className={'EventDetails-ShareEvent'}>
      {/* <h2 className={'EventDetails-Subtitle'}>{'Partager cet événement'}</h2> */}
      {!isServer && (
        <EventDetailsShare data={data} path={path} desktop={desktop} />
      )}
    </div>

    {/* DESCRIPTION */}
    {data.info && <div className={'EventDetails-Description'}>{data.info}</div>}

    {/* ACTIVITIES */}
    <div className={'EventDetails-Activities'}>
      <h2 className={'EventDetails-Subtitle'}>{'Épreuves'}</h2>
      {data.activities && data.activities.length ? (
        <EventDetailsActivities data={data} />
      ) : (
        <div>{`Aucune épreuve n'a été transmise par l'organisateur`}</div>
      )}
    </div>

    {/* FOOTER */}
    {!isServer && (
      <EventDetailsFooter
        data={data}
        desktop={desktop}
        onClickOrgaLink={onClickOrgaLink}
      />
    )}

    <style jsx>{style}</style>
  </div>
);

export default EventDetails;
