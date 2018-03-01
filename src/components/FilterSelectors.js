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

export const DistanceSelector = ({ onSelect, input }) => <div>{'WIP'}</div>;
