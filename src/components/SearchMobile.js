import dynamic from 'next/dynamic';
import debounce from 'lodash.debounce';

import { dominant, white } from '../colors';
import { HEIGHT_APPBAR, BORDER_RADIUS, MAX_WIDTH } from '../enums';
import { getSpacing, getFontSize } from '../styles-variables';

import Input from './Input';
import List from './List';

const GoogleMapPlacesApi = dynamic(import('./GoogleMapPlacesApi'), {
  ssr: false,
  loading: () => null
});

import IconArrowBack from '../svgs/ic_arrow_back_black_24px.svg';
import IconCross from '../svgs/baseline-clear-24px.svg';

const ListWrapper = ({ children }) => (
  <div className={`ListWrapper`}>
    {children}
    <style jsx>{`
      .ListWrapper {
        border-radius: ${BORDER_RADIUS}px;
        box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);
        margin-bottom: ${getSpacing('m')}px;
      }
    `}</style>
  </div>
);

const BIG_CITIES = [
  {
    value: 'Paris',
    geometry: {
      location: { lat: () => 48.85661400000001, lng: () => 2.3522219000000177 }
    }
  },
  {
    value: 'Lyon',
    geometry: {
      location: { lat: () => 45.764043, lng: () => 4.835658999999964 }
    }
  },
  {
    value: 'Marseille',
    geometry: {
      location: { lat: () => 43.296482, lng: () => 5.369779999999992 }
    }
  },
  {
    value: 'Bordeaux',
    geometry: {
      location: { lat: () => 44.837789, lng: () => -0.5791799999999512 }
    }
  }
];

class SearchMobile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      input: ''
    };

    this.handleInputReset = this.handleInputReset.bind(this);

    this.handleLocationInputUpdate = this.handleLocationInputUpdate.bind(this);
    this.handleLocationInputUpdate = debounce(
      this.handleLocationInputUpdate,
      250
    );
  }

  render() {
    return (
      <div className={'SearchMobile'}>
        <div className={'SearchMobile-Header'}>
          <div
            className={'Search-Icon--paddingRight'}
            onClick={() => this.props.onLeave()}
          >
            <IconArrowBack fill={'#fff'} style={{ verticalAlign: 'top' }} />
          </div>
          <Input
            placeholder={'Rechercher une ville'}
            onChange={this.handleLocationInputUpdate}
            reset={!this.state.input}
            focus={true}
          />
          {this.state.input && (
            <div
              className={'Search-Icon--paddingLeft'}
              onClick={this.handleInputReset}
            >
              <IconCross fill={'#fff'} style={{ verticalAlign: 'top' }} />
            </div>
          )}
        </div>

        <div className={'SearchMobile-Content'}>
          <ListWrapper>
            <List
              list={[{ value: 'Votre position' }]}
              onClick={this.props.onSelectAround}
            />
          </ListWrapper>
          <ListWrapper>
            <GoogleMapPlacesApi input={this.state.input}>
              {predictions =>
                this.state.input ? (
                  <List
                    list={predictions}
                    onClick={this.props.onSelectCity}
                    poweredByGoogle
                  />
                ) : (
                  <List list={BIG_CITIES} onClick={this.props.onSelectCity} />
                )
              }
            </GoogleMapPlacesApi>
          </ListWrapper>
        </div>

        <style jsx>{`
          .SearchMobile {
            position: fixed;
            top: 0;
            width: 100%;
            max-width: ${MAX_WIDTH}px;
            z-index: 20;
            left: 50%;
            transform: translate(-50%);
          }

          .SearchMobile-Header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: ${getSpacing('s')}px ${getSpacing('m')}px;
            background-color: ${dominant};
            height: ${HEIGHT_APPBAR}px;
          }

          .SearchMobile-Content {
            padding: ${getSpacing('s')}px;
          }

          .Search-Icon--paddingRight {
            padding-right: ${getSpacing('s')}px;
          }

          .Search-Icon--paddingLeft {
            padding-left: ${getSpacing('s')}px;
          }
        `}</style>
      </div>
    );
  }

  handleInputReset() {
    this.setState({ input: '' });
  }

  handleLocationInputUpdate(value) {
    this.setState({ input: value });
  }
}

export default SearchMobile;
