import moment from 'moment';

import List from './List';
import GoogleMapPlacesApi from './GoogleMapPlacesApi';

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

export const DistanceSelector = ({ onSelect, input }) => (
  <div className={'distanceSelector'}>
    <span className={'distanceSelector-value'} />
    <input
      type={'range'}
      min={'10'}
      max={'100'}
      step={'10'}
      value={'20'}
      onChange={onSelect}
    />
    <style jsx>{`
      .distanceSelector {
        transform-origin: bottom right;
        background: white;
        padding: 12px;
        border-radius: 4px;
      }

      .distanceSelector-value {
      }

      input {
        width: 100%;
        height: 24px;
        -webkit-appearance: none;
        position: relative;
      }

      input:focus {
        outline: none;
      }

      input:after {
        content: '';
        position: absolute;
        top: 24px;
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

      input::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        background: #bdc8c6;
        height: 8px;
        border-radius: 4px;
      }

      input::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: #264a43;
        height: 24px;
        width: 24px;
        border-radius: 50%;
        margin-top: -8px;
        box-shadow: 0 5px 2px 0 rgba(38, 74, 67, 0.1);
        transition: all 0.25s ease-in-out;
      }

      input:active::-webkit-slider-thumb {
        height: 22px;
        width: 22px;
        transform-origin: 50% 50%;
      }
    `}</style>
  </div>
);
