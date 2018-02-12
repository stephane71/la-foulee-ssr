import { dominant, white } from '../colors';
import { getSpacing } from '../styles-variables';
import { BORDER_RADIUS } from '../enums';

const Button = props => (
  <button style={{ ...props.style }} onClick={props.onClick}>
    {props.children}
    <style jsx>{`
      button {
        display: block;
        color: ${white};
        background-color: ${dominant};
        width: 100%;
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        margin-bottom: ${getSpacing('m')}px;
        border-radius: ${BORDER_RADIUS}px;
      }
    `}</style>
  </button>
);

export default Button;
