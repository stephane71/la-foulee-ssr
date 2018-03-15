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

import { getSpacing, getFontSize } from '../styles-variables';
import { BORDER_RADIUS } from '../enums';
import { white } from '../colors';

const CURRENT_MONTH = moment().format('MMMM');

const LOCATION_FILTER = 'location';
const DATE_FILTER = 'date';
const DISTANCE_FILTER = 'distance';

const DEFAULT_VALUES = {
  [LOCATION_FILTER]: null,
  [DATE_FILTER]: CURRENT_MONTH,
  [DISTANCE_FILTER]: null
};

const PLACEHOLDER = {
  [LOCATION_FILTER]: 'Choisissez une ville',
  [DATE_FILTER]: null,
  [DISTANCE_FILTER]: 'Toutes les distances'
};

const FILTERS = [
  {
    name: LOCATION_FILTER,
    Icon: GPSIcon,
    Selector: CitySelector,
    placeholder: PLACEHOLDER[LOCATION_FILTER],
    value: DEFAULT_VALUES[LOCATION_FILTER],
    marginLeft: false
  },
  {
    name: DATE_FILTER,
    Icon: DateIcon,
    Selector: MonthSelector,
    placeholder: PLACEHOLDER[DATE_FILTER],
    value: DEFAULT_VALUES[DATE_FILTER],
    marginLeft: true
  },
  {
    name: DISTANCE_FILTER,
    Icon: RunIcon,
    Selector: DistanceSelector,
    placeholder: PLACEHOLDER[DISTANCE_FILTER],
    value: DEFAULT_VALUES[DISTANCE_FILTER],
    marginLeft: true
  }
];

class FilterContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: LOCATION_FILTER,
      openFilter: null,
      filter: DEFAULT_VALUES
    };

    this.handleFilterClick = this.handleFilterClick.bind(this);
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
          <FilterSelectorWrapper key={i} name={name} open={openFilter === name}>
            <Selector
              onSelect={this.handleFilterSelectValue}
              input={filter[name]}
            />
          </FilterSelectorWrapper>
        ))}

        {FILTERS.map((props, i) => (
          <FilterTrigger
            key={i}
            {...props}
            active={activeFilter === props.name}
            onClick={this.handleFilterClick}
            onReset={this.handleFilterReset}
            isDefaultValue={filter[props.name] === DEFAULT_VALUES[props.name]}
          >
            {props.name === LOCATION_FILTER ? (
              <Input
                value={filter[LOCATION_FILTER]}
                placeholder={props.placeholder}
                onChange={this.handleLocationInputUpdate}
                focus={activeFilter === LOCATION_FILTER}
              />
            ) : filter[props.name] ? (
              filter[props.name]
            ) : (
              PLACEHOLDER[props.name]
            )}
          </FilterTrigger>
        ))}
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

  handleFilterClick(filterName) {
    let openFilter = filterName;
    if (this.state.activeFilter === filterName) {
      openFilter = this.state.openFilter ? null : openFilter;
    }
    this.setState({
      activeFilter: filterName,
      openFilter
    });
    this.props.onFilterOpen(openFilter);
  }

  handleFilterReset(filterName) {
    this.updateFilterValue(DEFAULT_VALUES[filterName], false);
  }
}

export default FilterContainer;

const FilterSelectorWrapper = ({ name, open, children }) => (
  <div
    className={`filterSelector filterSelector-${name} ${
      open ? 'filterSelector--open' : ''
    }`}
  >
    {children}
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
  </div>
);
