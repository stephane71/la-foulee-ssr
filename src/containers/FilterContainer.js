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
import { BORDER_RADIUS, ICON_SIZE } from '../enums';

// See FilterTrigger for the first part: 'ICON_SIZE + getSpacing('xs') * 2'
const FILTER_ACTIVATORS_HEIGHT =
  ICON_SIZE + getSpacing('xs') * 2 + getSpacing('xs');
const CURRENT_MONTH = moment().format('MMMM');

const LOCATION_FILTER = 'location';
const DATE_FILTER = 'date';
const DISTANCE_FILTER = 'distance';

const FILTERS = [
  {
    name: LOCATION_FILTER,
    Icon: GPSIcon,
    Selector: CitySelector,
    placeholder: 'Localisation',
    value: '',
    marginLeft: false
  },
  {
    name: DATE_FILTER,
    Icon: DateIcon,
    Selector: MonthSelector,
    placeholder: 'Date',
    value: '',
    marginLeft: true
  },
  {
    name: DISTANCE_FILTER,
    Icon: RunIcon,
    Selector: DistanceSelector,
    placeholder: 'Distance',
    value: '',
    marginLeft: true
  }
];

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
    const { filters, openFilter, activeFilter } = this.state;

    return (
      <div className={'filterContainer'}>
        {FILTERS.map(({ name, Selector }, i) => (
          <div
            key={i}
            className={`filterSelector ${
              openFilter === name ? 'filterSelector--active' : ''
            }`}
          >
            <Selector
              onSelect={this.handleSelectFilter}
              input={filters[name].value || ''}
            />
          </div>
        ))}

        {FILTERS.map((props, i) => (
          <FilterTrigger
            key={i}
            {...props}
            active={activeFilter === props.name}
            onFilterActivation={this.handleFilterActivation}
            value={filters[props.name].value}
          >
            {props.name === LOCATION_FILTER ? (
              <Input
                value={filters[props.name].value || ''}
                placeholder={'Choisissez une ville'}
                onChange={this.updateLocationInput}
                focus={activeFilter === props.name}
              />
            ) : null}
          </FilterTrigger>
        ))}

        <style jsx>{`
          .filterSelector {
            position: absolute;
            left: ${getSpacing('s')}px;
            right: ${getSpacing('s')}px;
            bottom: ${FILTER_ACTIVATORS_HEIGHT}px;

            background-color: #fff;
            border-radius: ${BORDER_RADIUS}px;
            box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);

            transition: all 0.25s ease-in-out;
            transform: scale(0);
            overflow: scroll;
          }

          .filterSelector--active {
            opacity: 1;
            transform: scale(1);
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
