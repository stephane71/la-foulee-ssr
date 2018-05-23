import Button from './Button';

import { getSpacing } from '../styles-variables';

export class HomePage extends React.PureComponent {
  render() {
    return (
      <div className={'HomePage'}>
        <h3>{'Bienvenue !'}</h3>
        <div className={'HomePage-descriptionText'}>
          <p>
            {`La Foulée vous permet de rechercher et trouver l'évenement de course
            qui pieds qui vous conviens.`}
          </p>
        </div>
        <div className={'HomePage-callToAction'}>
          <Button onClick={this.props.onClick}>{'Rechercher'}</Button>
        </div>
        <style jsx>{`
          .HomePage {
            text-align: center;
            padding: 0 ${getSpacing('m')}px;
          }

          .HomePage-descriptionText {
            padding: 0 ${getSpacing('l')}px;
          }

          .HomePage-callToAction {
            padding: 0 ${getSpacing('l')}px;
          }
        `}</style>
      </div>
    );
  }
}

export default HomePage;
