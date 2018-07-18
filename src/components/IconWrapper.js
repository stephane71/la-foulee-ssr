import { white } from '../colors';

const IconWrapper = IconComponent => ({ fill = white }) => (
  <IconComponent style={{ fill: fill, verticalAlign: 'middle' }} />
);

export default IconWrapper;
