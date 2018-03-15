import { dominant, white } from '../colors';
import { getSpacing } from '../styles-variables';
import { BORDER_RADIUS } from '../enums';

const Button = props => (
  <button style={{ ...props.style }} onClick={props.onClick}>
    {props.children}
    <style jsx>{`
      button {
        display: block;
        color: ${dominant};
        background-color: ${white};
        width: 100%;
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        border-radius: 20px;
        border: 1px solid ${dominant};
      }
    `}</style>
  </button>
);

export default Button;
