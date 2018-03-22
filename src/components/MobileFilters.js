import FilterContainer from '../containers/FilterContainer';

import { getSpacing } from '../styles-variables';

// prevent filters to be out on scroll when filters openned
// don't need to be the component state because the prop 'show' will trigger the render
let lockFilters = false;
const MobileFilters = ({ show }) => (
  <div
    className={`MobileFilters ${
      show || lockFilters ? '' : 'MobileFilters--out'
    }`}
  >
    <FilterContainer onFilterOpen={open => (lockFilters = open)} />
    <style jsx>{`
      .MobileFilters {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 ${getSpacing('xs')}px;
        padding-bottom: ${getSpacing('s')}px;
        transition: transform 0.3s ease-out;
        will-change: transform;
        z-index: 2;
      }

      .MobileFilters--out {
        transform: translateY(calc(100% + ${getSpacing('s')}px));
      }
    `}</style>
  </div>
);

export default MobileFilters;
