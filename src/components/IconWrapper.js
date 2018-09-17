import { white } from '../colors';

const IconWrapper = IconComponent => ({ fill = white, style = {} }) => (
  <IconComponent
    style={{ fill: fill, verticalAlign: 'middle', color: fill, ...style }}
  />
);

export default IconWrapper;
