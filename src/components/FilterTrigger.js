import { getSpacing } from '../styles-variables';
import { white, SECONDARY_COLOR } from '../colors';
import { BORDER_RADIUS, ICON_SIZE } from '../enums';

const FILTER_ICON_ACTION_WIDTH = ICON_SIZE + getSpacing('s') * 2;
const FILTER_MARGIN_LEFT = getSpacing('xxs');

const FilterTrigger = ({
  name,
  active,
  onFilterActivation,
  Icon,
  placeholder,
  value,
  marginLeft,
  children
}) => (
  <div
    className={`filterTrigger ${active ? 'active' : ''}`}
    onClick={() => onFilterActivation(name)}
  >
    <Icon
      style={{
        display: 'inline-block',
        verticalAlign: 'bottom',
        fill: `${SECONDARY_COLOR}`
      }}
    />

    <div className={'filterTrigger-extend'}>
      {children ? (
        children
      ) : (
        <span className={'filterTrigger-value'}>
          {value ? value : placeholder}
        </span>
      )}
    </div>

    <style jsx>{`
      .filterTrigger {
        display: inline-block;
        width: ${FILTER_ICON_ACTION_WIDTH}px;
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        margin-left: ${marginLeft ? `${FILTER_MARGIN_LEFT}px` : 0};
        background: ${white};
        border-radius: ${BORDER_RADIUS}px;

        box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);
        vertical-align: bottom;

        overflow: hidden;
        white-space: nowrap;
        transition: width 0.25s ease-out;
        cursor: pointer;
      }

      .filterTrigger.active {
        width: calc(
          100% - ${FILTER_ICON_ACTION_WIDTH * 2 + FILTER_MARGIN_LEFT * 2}px
        );
      }

      .filterTrigger-value {
        vertical-align: top;
        text-transform: capitalize;
      }

      .filterTrigger-extend {
        display: inline-block;
        margin-left: ${getSpacing('s')}px;
        width: calc(100% - ${getSpacing('s')}px - ${getSpacing('s')}px * 2);
      }
    `}</style>
  </div>
);

export default FilterTrigger;
