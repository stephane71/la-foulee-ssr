import React from 'react';
import moment from 'moment';
import debounce from 'lodash.debounce';

import FilterTrigger from '../components/FilterTrigger';
import Input from '../components/Input';

import {
  MonthSelector,
  CitySelector,
  DistanceSelector
} from '../components/FilterSelectors';

import GPSIcon from '../svgs/ic_gps_fixed_black_24px.svg';
import DateIcon from '../svgs/ic_date_range_black_24px.svg';
import RunIcon from '../svgs/ic_directions_run_black_24px.svg';

import { getSpacing } from '../styles-variables';
import { BORDER_RADIUS } from '../enums';

const CURRENT_MONTH = moment().format('MMMM');

const LOCATION_FILTER = 'location';
const DATE_FILTER = 'date';
const DISTANCE_FILTER = 'distance';

const FILTERS = [
  {
    name: LOCATION_FILTER,
    Icon: GPSIcon,
    placeholder: 'Localisation',
    value: '',
    marginLeft: false
  },
  {
    name: DATE_FILTER,
    Icon: DateIcon,
    placeholder: 'Date',
    value: '',
    marginLeft: true
  },
  {
    name: DISTANCE_FILTER,
    Icon: RunIcon,
    placeholder: 'Distance',
    value: '',
    marginLeft: true
  }
];

const FILTER_SELCTOR_MAP = {
  [LOCATION_FILTER]: CitySelector,
  [DATE_FILTER]: MonthSelector,
  [DISTANCE_FILTER]: DistanceSelector
};

class FilterContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: LOCATION_FILTER,
      openFilter: null,
      filters: {
        [LOCATION_FILTER]: { value: null },
        [DATE_FILTER]: { value: CURRENT_MONTH },
        [DISTANCE_FILTER]: { value: null }
      }
    };

    this.handleFilterActivation = this.handleFilterActivation.bind(this);
    this.handleSelectFilter = this.handleSelectFilter.bind(this);

    this.updateLocationInput = this.updateLocationInput.bind(this);
    this.updateLocationInput = debounce(this.updateLocationInput, 250);
  }

  render() {
    const { filters } = this.state;
    const activeFilterState = filters[this.state.activeFilter];
    const FilterComponent = FILTER_SELCTOR_MAP[this.state.activeFilter];

    return (
      <div className={'filterContainer'}>
        {this.state.openFilter && (
          <div className={'filterWrapper'}>
            <FilterComponent
              onSelect={this.handleSelectFilter}
              input={activeFilterState.value || ''}
            />
          </div>
        )}

        <div className={'filterActivators'}>
          {FILTERS.map((props, i) => (
            <FilterTrigger
              key={i}
              {...props}
              active={this.state.activeFilter === props.name}
              onFilterActivation={this.handleFilterActivation}
              value={filters[props.name].value}
            >
              {props.name === LOCATION_FILTER ? (
                <Input
                  value={filters[props.name].value || ''}
                  placeholder={'Choisissez une ville'}
                  onChange={this.updateLocationInput}
                />
              ) : null}
            </FilterTrigger>
          ))}
        </div>

        <style jsx>{`
          .filterActivators {
          }

          .filterWrapper {
            background-color: #fff;
            margin-bottom: ${getSpacing('s')}px;
            border-radius: ${BORDER_RADIUS}px;
            box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);
          }
        `}</style>
      </div>
    );
  }

  updateLocationInput(value) {
    this.setState(({ filters }) => ({
      filters: { ...filters, [LOCATION_FILTER]: { value } }
    }));
  }

  handleFilterActivation(filterName) {
    this.setState({ activeFilter: filterName, openFilter: filterName });
  }

  handleSelectFilter(data) {
    this.setState(({ filters }) => ({
      filters: { ...filters, [this.state.activeFilter]: data },
      openFilter: null
    }));
  }
}

export default FilterContainer;
