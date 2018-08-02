import css from 'styled-jsx/css';

import IconWrapper from './IconWrapper';
import NewsletterForm from './NewsletterForm';

import IconLocation from '../svgs/baseline-location_on-24px.svg';

import { getSpacing } from '../styles-variables';
import { dominant, white, getColor } from '../colors';
import { BORDER_RADIUS } from '../enums';

IconLocation = IconWrapper(IconLocation);

const style = css`
  .HomePage {
    height: 100%;
  }

  .HomePage-Main {
    display: flex;
    flex-direction: column;
    padding: 0 ${getSpacing('s')}px;
    padding-top: ${getSpacing('l')}px;
    margin: 0 auto;
    margin-bottom: ${getSpacing('m')}px;
    max-width: 600px;
  }

  .HomePage-Message {
    color: ${dominant};
    font-family: Circular-Medium;
    text-align: left;
    margin-top: 0;
  }

  .HomePage-Newsletter {
    padding: ${getSpacing('m')}px;
    padding-bottom: ${getSpacing('l')}px;
    max-width: 600px;
    margin: 0 auto;
    margin-top: ${getSpacing('xl')}px;
  }

  .HomePage-Newsletter--theme {
    background-color: ${getColor('darkGrey', 'tonic')};
    color: ${white};
  }

  .HomePage-NewsletterDescription {
  }
`;

export class HomePage extends React.PureComponent {
  render() {
    const { onClick } = this.props;

    return (
      <div className={'HomePage'}>
        <div className={`HomePage-Main `}>
          <h1 className={'HomePage-Message'}>
            <div>
              {`Toutes les courses à pieds`}
              <br />
              {` autour de chez vous.`}
            </div>
          </h1>
          <InputHome onClick={onClick} />
        </div>

        <div className={`HomePage-Newsletter HomePage-Newsletter--theme`}>
          <h2>{`Ce n'est que le commencement`}</h2>
          <p
            className={'HomePage-NewsletterDescription'}
          >{`Inscrivez vous à la newsletter et découvrez l'ambition du projet.`}</p>
          <NewsletterForm
            postNewsletterEmail={this.props.postNewsletterEmail}
          />
        </div>

        <style jsx>{style}</style>
      </div>
    );
  }
}

const InputHome = ({ onClick }) => (
  <div className={'InputHome'} onClick={onClick}>
    <IconLocation fill={dominant} />
    <span className={'InputHome-Message'}>{'Autour de quelle ville ?'}</span>

    <style jsx>{`
      .InputHome {
        background-color: ${white};
        padding: ${getSpacing('s')}px ${getSpacing('m')}px;
        box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);
        border-radius: ${BORDER_RADIUS}px;
      }

      .InputHome:hover {
        cursor: pointer;
      }

      .InputHome-Message {
        color: ${getColor('mediumGrey', 'tonic')};
        padding-left: ${getSpacing('xs')}px;
      }
    `}</style>
  </div>
);

export default HomePage;
