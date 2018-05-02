import React, { Fragment } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';

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

import { setSelectors } from '../actions';
import { getSpacing, getFontSize } from '../styles-variables';
import { white } from '../colors';
import {
  DEFAULT_SELECTOR_VALUES,
  LOCATION_FILTER,
  DATE_FILTER,
  DISTANCE_FILTER,
  BORDER_RADIUS
} from '../enums';

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
    value: DEFAULT_SELECTOR_VALUES[LOCATION_FILTER],
    marginLeft: false
  },
  {
    name: DATE_FILTER,
    Icon: DateIcon,
    Selector: MonthSelector,
    placeholder: PLACEHOLDER[DATE_FILTER],
    value: DEFAULT_SELECTOR_VALUES[DATE_FILTER],
    marginLeft: true
  },
  {
    name: DISTANCE_FILTER,
    Icon: RunIcon,
    Selector: DistanceSelector,
    placeholder: PLACEHOLDER[DISTANCE_FILTER],
    value: DEFAULT_SELECTOR_VALUES[DISTANCE_FILTER],
    marginLeft: true
  }
];

class FilterContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: LOCATION_FILTER,
      openFilter: null,
      filter: props.selectors
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
          <FilterSelectorWrapper
            key={i}
            name={name}
            open={openFilter === name}
            desktop={this.props.desktop}
          >
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
            desktop={this.props.desktop}
            isDefaultValue={
              filter[props.name] === DEFAULT_SELECTOR_VALUES[props.name]
            }
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

  getNewFilterState(value, keepFilterOpenned = false) {
    const filter = {
      ...this.state.filter,
      [this.state.activeFilter]: value
    };

    return {
      filter,
      openFilter: keepFilterOpenned ? this.state.activeFilter : null
    };
  }

  dispatchFilterUpdate(value) {
    const newState = this.getNewFilterState(value, false);
    this.setState(newState);
    this.props.dispatch(setSelectors(newState.filter));
  }

  // INPUT CITY SELECTOR

  handleLocationInputUpdate(value) {
    this.setState(this.getNewFilterState(value, true));
    if (this.props.onFilterOpen) this.props.onFilterOpen(true);
  }

  // FILTER SELECTORS

  handleFilterSelectValue(data) {
    this.dispatchFilterUpdate(data.value);
    if (this.props.onFilterOpen) this.props.onFilterOpen(false);
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
    if (this.props.onFilterOpen) this.props.onFilterOpen(openFilter);
  }

  handleFilterReset(filterName) {
    this.dispatchFilterUpdate(DEFAULT_SELECTOR_VALUES[filterName]);
  }
}

function mapStateToProps(state) {
  return {
    selectors: state.selectors
  };
}

export default connect(mapStateToProps)(FilterContainer);

const FilterSelectorWrapper = ({ name, open, desktop, children }) => (
  <div
    className={`filterSelector filterSelector-${name} ${
      desktop ? 'filterSelector--desktop' : 'filterSelector--mobile'
    } ${open ? 'filterSelector--open' : ''}`}
  >
    {children}
    <style jsx>{`
      .filterSelector {
        position: absolute;
        left: ${getSpacing('xs')}px;
        right: ${getSpacing('xs')}px;
        font-size: ${getFontSize('s')}px;
        background-color: ${white};
        border-radius: ${BORDER_RADIUS}px;
        box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);

        transition: all 0.25s ease-in-out;
        transform: scale(0);
        will-change: transform;
        overflow-y: auto;
      }

      .filterSelector--mobile {
        bottom: calc(${getSpacing('l')}px + ${getSpacing('s')}px);
      }

      .filterSelector--desktop {
        top: calc(${getSpacing('l')}px + ${getSpacing('s')}px);
      }

      .filterSelector--open {
        opacity: 1;
        transform: scale(1);
      }
    `}</style>

    <style jsx>{`
      .filterSelector-location {
        transform-origin: ${desktop ? 'top' : 'bottom'} left;
      }

      .filterSelector-date {
        transform-origin: ${desktop ? 'top' : 'bottom'} center;
      }

      .filterSelector-distance {
        transform-origin: ${desktop ? 'top' : 'bottom'} right;
      }
    `}</style>
  </div>
);
