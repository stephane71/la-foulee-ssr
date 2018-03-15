import moment from 'moment';

import List from './List';
import Button from './Button';
import GoogleMapPlacesApi from './GoogleMapPlacesApi';

import { BORDER_RADIUS } from '../enums';
import { getSpacing } from '../styles-variables';
import { dominant } from '../colors';

const MONTH_LIST = moment.months().map(month => ({
  value: month,
  check: false
}));

export const MonthSelector = ({ onSelect, input }) => (
  <div className={'monthSelector'}>
    <List
      list={MONTH_LIST.map(data => {
        data.check = data.value === input;
        return data;
      })}
      onClick={onSelect}
    />
    <style jsx>{`
      .monthSelector {
        height: 220px;
        overflow-y: auto;
      }
    `}</style>
  </div>
);

export const CitySelector = ({ onSelect, input }) => (
  <GoogleMapPlacesApi input={input}>
    {predictions => (
      <List
        list={predictions
          .slice(0, 3)
          .reverse()
          .map(value => ({
            value,
            check: value === input
          }))}
        onClick={onSelect}
      />
    )}
  </GoogleMapPlacesApi>
);

const DEFAULT_INPUT_DISTANCE_VALUE = 50;

export class DistanceSelector extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.input
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.input && this.props.input !== nextProps.input) {
      this.setState({ value: nextProps.input });
    }
  }

  render() {
    return (
      <div className={'DistanceSelector'}>
        <h6 className={'DistanceSelector-header'}>
          {!this.state.value
            ? `Sélectionnez une distance`
            : `~ ${this.state.value}km`}
        </h6>
        <input
          type={'range'}
          min={10}
          max={100}
          step={10}
          value={this.state.value || DEFAULT_INPUT_DISTANCE_VALUE}
          onChange={this.handleInputChange}
          className={'DistanceSelector-input'}
        />

        <Button
          onClick={() => this.props.onSelect({ value: this.state.value })}
        >
          {'Appliquer'}
        </Button>

        <style jsx>{`
          .DistanceSelector-header {
            text-align: center;
            color: ${dominant};
            margin-bottom: 0;
          }

          .DistanceSelector {
            padding: ${getSpacing('s')}px;
          }

          .DistanceSelector-input {
            width: 100%;
            height: ${getSpacing('m')}px;
            appearance: none;
            position: relative;
            margin: ${getSpacing('l')}px 0;
          }

          .DistanceSelector-input:focus {
            outline: none;
          }

          .DistanceSelector-input:after {
            content: '';
            position: absolute;
            top: ${getSpacing('m')}px;
            left: 0;
            right: 0;
            height: 6px;
            z-index: 0;
            background: repeating-linear-gradient(
                90deg,
                #d8d8d8,
                #d8d8d8 2px,
                transparent 2px,
                transparent calc(10% + 1px)
              )
              no-repeat 11px 0 border-box;
          }

          .DistanceSelector-input::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            background: #bdc8c6;
            height: 8px;
            border-radius: 4px;
          }

          .DistanceSelector-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            background-color: #264a43;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            margin-top: -8px;
            box-shadow: 0 5px 2px 0 rgba(38, 74, 67, 0.1);
            transition: all 0.25s ease-in-out;
          }

          .DistanceSelector-input:active::-webkit-slider-thumb {
            height: 22px;
            width: 22px;
            transform-origin: 50% 50%;
          }
        `}</style>
      </div>
    );
  }

  handleInputChange({ target }) {
    this.setState({ value: parseInt(target.value) });
  }
}
