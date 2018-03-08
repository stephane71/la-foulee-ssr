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
import { getFontSize } from '../styles-variables';
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
      filter: {
        [LOCATION_FILTER]: LOCATION_DEFAULT,
        [DATE_FILTER]: DATE_DEFAULT,
        [DISTANCE_FILTER]: DISTANCE_DEFAULT
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
    const { filter, openFilter, activeFilter } = this.state;

    return (
      <Fragment>
        {FILTERS.map(({ name, Selector }, i) => (
          <div
            key={i}
            className={`filterSelector filterSelector-${name} ${
              openFilter === name ? 'filterSelector--open' : ''
            }`}
          >
            <Selector
              onSelect={this.handleFilterSelectValue}
              input={filter[name] || ''}
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
                value={filter[LOCATION_FILTER]}
                placeholder={LOCATION_PLACEHOLDER}
                onChange={this.handleLocationInputUpdate}
                focus={activeFilter === LOCATION_FILTER}
              />
            ) : (
              filter[props.name]
            )}
          </FilterTrigger>
        ))}

        <style jsx>{`
          .filterSelector {
            position: absolute;
            bottom: calc(${getSpacing('l')}px + ${getSpacing('s')}px);
            left: ${getSpacing('xs')}px;
            right: ${getSpacing('xs')}px;
            font-size: ${getFontSize('s')}px;


            background-color: ${white};
            border-radius: ${BORDER_RADIUS}px;
            box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);

            transition: all 0.25s ease-in-out;
            transform: scale(0);
            transform-origin: bottom left;
            will-change: transform;
            overflow-y: auto;
          }

          .filterSelector-date {
            transform-origin: bottom center;
          }

          .filterSelector-distance {
            transform-origin: bottom right;
          }

          .filterSelector--open {
            opacity: 1;
            transform: scale(1);
          }
        `}</style>
      </Fragment>
    );
  }

  updateFilterValue(value, keepFilterOpenned = false) {
    this.setState(({ filter }) => ({
      filter: { ...filter, [this.state.activeFilter]: value },
      openFilter: keepFilterOpenned ? this.state.activeFilter : null
    }));
    this.props.onFilterOpen(keepFilterOpenned);
  }

  handleLocationInputUpdate(value) {
    this.updateFilterValue(value, true);
  }

  // FILTER SELECTORS

  handleFilterSelectValue(data) {
    this.updateFilterValue(data.value, false);
  }

  // FILTER TRIGGERS

  handleFilterActivation(filterName) {
    this.setState({ activeFilter: filterName, openFilter: filterName });
    this.props.onFilterOpen(true);
  }

  handleFilterReset(filterName) {
    let defaultValue = FILTERS.find(
      ({ name }) => name === this.state.activeFilter
    ).value;
    this.updateFilterValue(defaultValue, false);
  }
}

export default FilterContainer;
