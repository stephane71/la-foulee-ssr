import ResetIcon from '../svgs/ic_close_black_24px.svg';

import { getSpacing, getFontSize } from '../styles-variables';
import { white, SECONDARY_COLOR } from '../colors';
import { BORDER_RADIUS, ICON_SIZE } from '../enums';

const FILTER_ICON_ACTION_WIDTH = ICON_SIZE + getSpacing('s') * 2;
const FILTER_MARGIN_LEFT = getSpacing('xxs');
const FILTER_ICON_ACTION_COLOR = '#67807B';

const inlineIconStyle = {
  display: 'inline-block',
  verticalAlign: 'bottom',
  fill: `${FILTER_ICON_ACTION_COLOR}`
};

const FilterTrigger = ({
  name,
  active,
  onClick,
  onReset,
  Icon,
  placeholder,
  marginLeft,
  children
}) => (
  <div
    className={`filterTrigger ${active ? 'filterTrigger--active' : ''}`}
    onClick={() => onClick(name)}
  >
    <Icon style={{ ...inlineIconStyle }} />

    <div className={'filterTrigger-extend'}>
      {children ? children : placeholder}
    </div>

    <ResetIcon
      style={{ ...inlineIconStyle }}
      onClick={e => {
        e.stopPropagation();
        onReset(name);
      }}
    />

    <style jsx>{`
      .filterTrigger {
        display: inline-block;
        width: ${FILTER_ICON_ACTION_WIDTH}px;
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        margin-left: ${marginLeft ? `${FILTER_MARGIN_LEFT}px` : 0};
        background: ${white};
        border-radius: ${BORDER_RADIUS}px;
        font-size: ${getFontSize('s')}px;

        box-shadow: 0 5px 20px 0 rgba(38, 74, 67, 0.2);
        vertical-align: bottom;

        overflow: hidden;
        white-space: nowrap;
        transition: width 0.25s ease-out;
        cursor: pointer;
      }

      .filterTrigger.filterTrigger--active {
        width: calc(
          100% - ${FILTER_ICON_ACTION_WIDTH * 2 + FILTER_MARGIN_LEFT * 2}px
        );
      }

      .filterTrigger-extend {
        display: inline-block;
        margin-left: ${getSpacing('s')}px;
        width: calc(100% - ${ICON_SIZE}px - 3 * ${getSpacing('s')}px);
        text-transform: capitalize;
      }
    `}</style>
  </div>
);

export default FilterTrigger;
