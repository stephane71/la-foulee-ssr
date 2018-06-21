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
    background-color: ${dominant};
    color: ${white};
  }

  .EventListHeader-Title {
    margin: ${getSpacing('s')}px 0;
  }
`;

const EventListHeader = ({ city, nbItems }) => {
  if (!city) return null;
  return (
    <div className={'EventListHeader'}>
      <h1 className={'EventListHeader-Title'}>{city.name}</h1>
      <div>{`${nbItems} événements autour de ${city.name}`}</div>
      <style jsx>{style}</style>
    </div>
  );
};

export default props => (
  <SelectedCityContext.Consumer>
    {city => <EventListHeader {...props} city={city} />}
  </SelectedCityContext.Consumer>
);
