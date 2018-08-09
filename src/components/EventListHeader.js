import css from 'styled-jsx/css';

import { SelectedCityContext } from './Layout';

import { getSpacing } from '../styles-variables';
import { BORDER_RADIUS_LIST_ITEM } from '../enums';
import { dominant, white } from '../colors';

const style = css`
  .EventListHeader {
    margin: ${getSpacing('s')}px;
    padding: ${getSpacing('m')}px ${getSpacing('s')}px;
    border-radius: ${BORDER_RADIUS_LIST_ITEM}px;
    color: ${white};
    text-shadow: black 1px 0 10px;
    background-color: ${dominant};
  }

  .EventListHeader-Title {
    margin: ${getSpacing('s')}px 0;
  }
`;

const EventListHeader = ({ city, nbItems }) => {
  if (!city) return null;

  const photoRef = city.photos
    ? city.photos[0].getUrl({
        maxWidth: 800,
        maxHeight: 400
      })
    : null;

  return (
    <div
      className={`EventListHeader ${photoRef ? 'EventListHeader-Image' : ''}`}
    >
      <h1 className={'EventListHeader-Title'}>{city.name}</h1>
      <div>{`${nbItems} événements autour de ${city.name}`}</div>

      <style jsx>{style}</style>
      <style jsx>{`
        .EventListHeader-Image {
          background: url(${photoRef}) center center no-repeat, ${dominant};
          background-size: cover;
        }
      `}</style>
    </div>
  );
};

export default props => (
  <SelectedCityContext.Consumer>
    {city => <EventListHeader {...props} city={city} />}
  </SelectedCityContext.Consumer>
);
