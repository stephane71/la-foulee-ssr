import { dominant, white } from '../colors';
import { getSpacing } from '../styles-variables';
import { BORDER_RADIUS } from '../enums';

const A = props => (
  <a style={{ ...props.style }} href={props.href} target={'_blank'}>
    {props.children}
    <style jsx>{`
      a {
        display: block;
        color: ${white};
        background-color: ${dominant};
        width: 100%;
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        margin-bottom: ${getSpacing('m')}px;
        text-align: center;
        text-decoration: none;
        border-radius: ${BORDER_RADIUS}px;
      }
    `}</style>
  </a>
);

export default A;
