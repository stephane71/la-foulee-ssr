import css from 'styled-jsx/css';

import { getSpacing } from '../styles-variables';
import { listBorderColor, getColor } from '../colors';
import { BORDER_RADIUS } from '../enums';

const style = css`
  .selectListItemsWrapper {
    border: 1px solid ${listBorderColor};
    border-radius: ${BORDER_RADIUS}px;
  }

  .selectItemWrapper {
    padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
  }

  .selectItemWrapper:hover {
    background-color: ${getColor('lightGrey', 'tonic')};
  }

  .selectListItemsWrapper--hidden {
    display: none;
  }
`;

class SelectListItems extends React.PureComponent {
  render() {
    if (!this.props.items.length) return null;
    return (
      <div
        className={`selectListItemsWrapper ${this.props.hide &&
          'selectListItemsWrapper--hidden'}`}
      >
        {this.props.items.map((item, i) => (
          <div
            key={i}
            className={'selectItemWrapper'}
            onClick={() => this.props.onSelect(item)}
          >
            {item}
          </div>
        ))}

        <style jsx>{style}</style>
      </div>
    );
  }
}

export default SelectListItems;
