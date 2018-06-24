import dynamic from 'next/dynamic';
import debounce from 'lodash.debounce';
import css from 'styled-jsx/css';

import { dominant, white, SECONDARY_COLOR } from '../colors';
import { HEIGHT_APPBAR, BORDER_RADIUS, MAX_WIDTH } from '../enums';
import { getSpacing } from '../styles-variables';

import Input, { KEYBOARD_NAV_UP, KEYBOARD_NAV_DOWN } from './Input';
import List from './List';

import GoogleMapsAutocomplete from './GoogleMapsAutocomplete';
const GoogleMapInitServices = dynamic(import('./GoogleMapInitServices'), {
  ssr: false,
  loading: () => null
});

import IconArrowBack from '../svgs/ic_arrow_back_black_24px.svg';
import IconCross from '../svgs/baseline-clear-24px.svg';
import IconNearMe from '../svgs/baseline-near_me-24px.svg';

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

const style = css`
  .SearchMobile {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: ${MAX_WIDTH}px;
    z-index: 100;
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
`;

const BIG_CITIES = [
  {
    value: 'Bordeaux',
    name: 'Bordeaux',
    location: { lat: 44.837789, lng: -0.5791799999999512 }
  },

  {
    value: 'Lille',
    name: 'Lille',
    location: { lat: 50.656234, lng: 3.046963 }
  },
  {
    value: 'Lyon',
    name: 'Lyon',
    location: { lat: 45.764043, lng: 4.835658999999964 }
  },

  {
    value: 'Marseille',
    name: 'Marseille',
    location: { lat: 43.296482, lng: 5.369779999999992 }
  },
  {
    value: 'Paris',
    name: 'Paris',
    location: { lat: 48.85661400000001, lng: 2.3522219000000177 }
  }
];

class SearchMobile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      keyboardItemSelect: 0,
      keyboardValidation: false
    };

    this.handleInputReset = this.handleInputReset.bind(this);

    this.handleLocationInputUpdate = this.handleLocationInputUpdate.bind(this);
    this.handleLocationInputUpdate = debounce(
      this.handleLocationInputUpdate,
      250
    );
    this.handleKeyboardItemSelection = this.handleKeyboardItemSelection.bind(
      this
    );
    this.handleKeyboardValidation = this.handleKeyboardValidation.bind(this);
  }

  render() {
    return (
      <div className={'SearchMobile'}>
        <GoogleMapInitServices />
        <div className={'SearchMobile-Header'}>
          <div
            className={'Search-Icon--paddingRight'}
            onClick={() => this.props.onLeave()}
          >
            <IconArrowBack fill={white} style={{ verticalAlign: 'top' }} />
          </div>
          <Input
            placeholder={'Sélectionner une ville'}
            onChange={this.handleLocationInputUpdate}
            reset={!this.state.input}
            focus={true}
            onKeyboardNavigation={this.handleKeyboardItemSelection}
            onKeyboardValidation={this.handleKeyboardValidation}
          />
          {this.state.input && (
            <div
              className={'Search-Icon--paddingLeft'}
              onClick={this.handleInputReset}
            >
              <IconCross fill={white} style={{ verticalAlign: 'top' }} />
            </div>
          )}
        </div>

        <div className={'SearchMobile-Content'}>
          <ListWrapper>
            <List
              list={[{ value: 'Votre position', Icon: IconNearMe }]}
              renderItem={({ value, Icon }) => (
                <div>
                  <Icon
                    style={{
                      fill: SECONDARY_COLOR,
                      verticalAlign: 'top',
                      marginRight: getSpacing('s')
                    }}
                  />
                  <span>{value}</span>
                </div>
              )}
              onClick={this.props.onSelectAround}
              highlightIndex={this.state.keyboardItemSelect - 1}
              highlightIndexValidation={this.state.keyboardValidation}
            />
          </ListWrapper>

          <ListWrapper>
            <GoogleMapsAutocomplete input={this.state.input}>
              {predictions => {
                const data = this.state.input ? predictions : BIG_CITIES;
                this.nbItems = data.length + 1;
                return (
                  <List
                    list={data}
                    onClick={this.props.onSelectCity}
                    highlightIndex={this.state.keyboardItemSelect - 2}
                    highlightIndexValidation={this.state.keyboardValidation}
                    poweredByGoogle={this.state.input}
                  />
                );
              }}
            </GoogleMapsAutocomplete>
          </ListWrapper>
        </div>

        <style jsx>{style}</style>
      </div>
    );
  }

  nbItems = 0;

  handleInputReset() {
    this.setState({ input: '' });
  }

  handleLocationInputUpdate(value) {
    this.setState({ input: value });
  }

  handleKeyboardItemSelection(direction) {
    let index = this.state.keyboardItemSelect;
    if (direction === KEYBOARD_NAV_UP) {
      index = index === 1 ? this.nbItems : index - 1;
    }
    if (direction === KEYBOARD_NAV_DOWN) {
      index = index >= this.nbItems ? 1 : index + 1;
    }
    this.setState({ keyboardItemSelect: index });
  }

  handleKeyboardValidation() {
    this.setState({ keyboardValidation: true });
  }
}

export default SearchMobile;
