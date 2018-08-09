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

class EventListHeader extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      photo: this.getPhoto(props.city),
      previousPhoto: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.city !== nextProps.city) {
      const photo = this.getPhoto(nextProps.city);

      this.setState({ previousPhoto: this.state.photo, photo });
    }
  }

  render() {
    const { photo, previousPhoto } = this.state;
    const { city, nbItems } = this.props;

    if (!city) return null;

    const backgroundCurrent = photo
      ? `url(${photo}) center center no-repeat,`
      : '';
    const backgroundPrevious = previousPhoto
      ? `url(${previousPhoto}) center center no-repeat,`
      : '';

    return (
      <div className={`EventListHeader EventListHeader-Image`}>
        <h1 className={'EventListHeader-Title'}>{city.name}</h1>
        <div>{`${nbItems} événements autour de ${city.name}`}</div>

        <style jsx>{style}</style>
        <style jsx>{`
          .EventListHeader-Image {
            background: ${backgroundCurrent} ${photo ? backgroundPrevious : ''}
              ${dominant};
            background-size: cover;
          }
        `}</style>
      </div>
    );
  }

  getPhoto(city) {
    return city.photos
      ? city.photos[0].getUrl({
          maxWidth: 800,
          maxHeight: 400
        })
      : null;
  }
}

export default props => (
  <SelectedCityContext.Consumer>
    {city => <EventListHeader {...props} city={city} />}
  </SelectedCityContext.Consumer>
);
