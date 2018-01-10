import { dominant, white } from '../colors';
import { getSpacing } from '../styles-variables';

const Button = props => (
  <button style={{ ...props.style }}>
    {props.children}
    <style jsx>{`
      button {
        display: block;
        color: ${white};
        background-color: ${dominant};
        width: 100%;
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        margin-bottom: ${getSpacing('m')}px;
      }
    `}</style>
  </button>
);

export default Button;
