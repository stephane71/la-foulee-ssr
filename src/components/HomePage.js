import { getSpacing, getFontSize } from '../styles-variables';

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
        <style jsx>{`
          .HomePage {
            text-align: center;
            padding: 0 ${getSpacing('m')}px;
          }

          .HomePage-descriptionText {
            padding: 0 ${getSpacing('l')}px;
          }

          .Button {
            background: #264a43;
            color: #f4f5f7;
            text-transform: uppercase;
            font-size: ${getFontSize('s')}px;
            padding: ${getSpacing('s')}px ${getSpacing('m')}px;
            text-decoration: none;
            border-radius 24px;
            outline: none;
          }

          .Button--fixed {
            box-shadow: 0 10px 20px 0 rgba(38,74,67,0.05);
          }
        `}</style>
      </div>
    );
  }
}

export default HomePage;
