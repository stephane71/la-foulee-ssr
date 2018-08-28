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

  @media (max-width: ${MAX_WIDTH}px) {
    .EventDetails-Footer {
      bottom: 0;
    }
  }
`;

const EventDetailsFooter = ({ data, desktop, onClickOrgaLink }) => (
  <footer
    className={`EventDetails-Footer ${
      desktop ? 'EventDetails-Footer--desktop' : 'EventDetails-Footer--mobile'
    }`}
  >
    <a
      onClick={() => onClickOrgaLink(data.keyword)}
      href={getOrgaLink(data)}
      target={'_blank'}
      className={'Button Button--fixed Button-Theme--dominant Button-Size--m'}
    >{`Site de l'organisateur`}</a>

    <style jsx>{style}</style>
  </footer>
);

export default EventDetailsFooter;
