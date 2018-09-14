import css from 'styled-jsx/css';
import moment from 'moment';

import { getSpacing } from '../styles-variables';
import { MAX_WIDTH } from '../enums';

function getOrgaLink({ keyword, webSite = [], date }) {
  if (webSite.length) return webSite[0];
  return `https://www.google.com/search?q=${keyword.replace(
    /\-/g,
    '+'
  )} ${moment
    .unix(date)
    .utc()
    .year()}`;
}

const style = css`
  .EventDetailsOrgaLink {
    padding: ${getSpacing('s')}px;
    text-align: center;
  }
`;

const EventDetailsOrgaLink = ({ data, desktop, onClickOrgaLink }) => (
  <div className={`EventDetailsOrgaLink`}>
    <a
      onClick={() => onClickOrgaLink(data.keyword)}
      href={getOrgaLink(data)}
      target={'_blank'}
      className={'Button Button--fixed Button-Theme--dominant Button-Size--m'}
    >{`Site de l'organisateur`}</a>

    <style jsx>{style}</style>
  </div>
);

export default EventDetailsOrgaLink;
