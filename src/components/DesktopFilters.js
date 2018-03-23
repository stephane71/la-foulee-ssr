import FilterContainer from '../containers/FilterContainer';

import { getSpacing } from '../styles-variables';
import { HEIGHT_APPBAR, MAX_WIDTH } from '../enums';

export const DESKTOP_HEIGHT_FILTERS = 56;

const DesktopFilters = () => (
  <div className={`DesktopFilters`}>
    <FilterContainer desktop />
    <style jsx>{`
      .DesktopFilters {
        position: fixed;
        top: ${HEIGHT_APPBAR}px;
        left: 0;
        right: 0;
        padding: ${getSpacing('xs')}px;
        max-width: ${MAX_WIDTH}px;
        margin: 0 auto;
        z-index: 10;
      }
    `}</style>
  </div>
);

export default DesktopFilters;
