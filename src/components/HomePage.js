import css from 'styled-jsx/css';

import { getSpacing, getFontSize } from '../styles-variables';

const style = css`
  .HomePage {
    text-align: center;
    padding: 0 ${getSpacing('m')}px;
  }

  .HomePage-descriptionText {
    padding: 0 ${getSpacing('l')}px;
  }
`;

export class HomePage extends React.PureComponent {
  render() {
    return (
      <div className={'HomePage'}>
        <h3>{'Bienvenue !'}</h3>
        <div className={'HomePage-descriptionText'}>
          <p>
            {`Recherchez un événement de course à pieds autour de chez vous !`}
          </p>
        </div>

        <button className={'Button Button--fixed'} onClick={this.props.onClick}>
          {'Rechercher'}
        </button>

        <style jsx>{style}</style>
      </div>
    );
  }
}

export default HomePage;
