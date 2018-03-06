import React, { Fragment } from 'react';
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
import { white } from '../colors';

const CURRENT_MONTH = moment().format('MMMM');

const LOCATION_FILTER = 'location';
const DATE_FILTER = 'date';
const DISTANCE_FILTER = 'distance';

const LOCATION_DEFAULT = null;
const DATE_DEFAULT = CURRENT_MONTH;
const DISTANCE_DEFAULT = null;

const LOCATION_PLACEHOLDER = 'Choisissez une ville';

const FILTERS = [
  {
    name: LOCATION_FILTER,
    Icon: GPSIcon,
    Selector: CitySelector,
    placeholder: LOCATION_PLACEHOLDER,
    value: LOCATION_DEFAULT,
    marginLeft: false
  },
  {
    name: DATE_FILTER,
    Icon: DateIcon,
    Selector: MonthSelector,
    placeholder: DATE_DEFAULT,
    value: DATE_DEFAULT,
    marginLeft: true
  },
  {
    name: DISTANCE_FILTER,
    Icon: RunIcon,
    Selector: DistanceSelector,
    placeholder: 'Distance',
    value: DISTANCE_DEFAULT,
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
        [LOCATION_FILTER]: { value: LOCATION_DEFAULT },
        [DATE_FILTER]: { value: DATE_DEFAULT },
        [DISTANCE_FILTER]: { value: DISTANCE_DEFAULT }
      }
    };

    this.handleFilterActivation = this.handleFilterActivation.bind(this);
    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.handleFilterSelectValue = this.handleFilterSelectValue.bind(this);

    this.handleLocationInputUpdate = this.handleLocationInputUpdate.bind(this);
    this.handleLocationInputUpdate = debounce(
      this.handleLocationInputUpdate,
      250
    );
  }

  render() {
    const { filters, openFilter, activeFilter } = this.state;

    return (
      <Fragment>
        {FILTERS.map(({ name, Selector }, i) => (
          <div
            key={i}
            className={`filterSelector ${
              openFilter === name ? 'filterSelector--open' : ''
            }`}
          >
            <Selector
              onSelect={this.handleFilterSelectValue}
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
            onReset={this.handleFilterReset}
          >
            {props.name === LOCATION_FILTER ? (
              <Input
                value={filters[LOCATION_FILTER].value}
                placeholder={LOCATION_PLACEHOLDER}
                onChange={this.handleLocationInputUpdate}
                focus={activeFilter === LOCATION_FILTER}
              />
            ) : (
              filters[props.name].value
            )}
          </FilterTrigger>
        ))}

        <style jsx>{`
          .filterSelector {
            display: none;
            margin-bottom: ${getSpacing('s')}px;

            background-color: ${white};
            border-radius: ${BORDER_RADIUS}px;
            box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);

            transition: all 0.25s ease-in-out;
            transform: scale(0);
            will-change: transform;
            overflow-y: auto;
          }

          .filterSelector--open {
            // FIXE ME: no more animation in transition with display toggle
            display: block;
            opacity: 1;
            transform: scale(1);
          }
        `}</style>
      </Fragment>
    );
  }

  handleLocationInputUpdate(value) {
    this.setState(({ filters }) => ({
      filters: { ...filters, [LOCATION_FILTER]: { value } }
    }));
  }

  // FILTER SELECTORS

  handleFilterSelectValue(data) {
    this.setState(({ filters }) => ({
      filters: { ...filters, [this.state.activeFilter]: data },
      openFilter: null
    }));
    this.props.onToggleOpenning(false);
  }

  // FILTER TRIGGERS

  handleFilterActivation(filterName) {
    this.setState({ activeFilter: filterName, openFilter: filterName });
    this.props.onToggleOpenning(true);
  }

  handleFilterReset(filterName) {
    let defaultValue = FILTERS.find(({ name }) => name === filterName).value;
    this.setState(({ filters }) => ({
      filters: {
        ...filters,
        [this.state.activeFilter]: { value: defaultValue }
      }
    }));
  }
}

export default FilterContainer;
