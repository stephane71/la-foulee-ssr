import Button from './Button';

import { getSpacing } from '../styles-variables';
import { getColor } from '../colors';

const EventListNotFoundError = ({ onTriggerSearch }) => (
  <div className={'EventListNotFoundError'}>
    <h3>{'Aucun résultat'}</h3>
    <p
    >{`Afin d'obtenir davantage de résultats, essayez notre moteur de cherche.\nVous pouvez ainsi trouver la commune de votre choix et la liste des évènements autour de cette commune.`}</p>
    <Button onClick={onTriggerSearch}>{`Rechercher une commune`}</Button>
    <hr />
    <style jsx>{`
      .EventListNotFoundError {
        padding: ${getSpacing('m')}px ${getSpacing('s')}px;
      }

      .EventListNotFoundError > p {
        white-space: pre-line;
      }

      .EventListNotFoundError > hr {
        margin-top: ${getSpacing('m')}px;
        height: 1px;
        border: 0;
        border-top: 1px solid ${getColor('extraLight')};
      }
    `}</style>
  </div>
);

export default EventListNotFoundError;
