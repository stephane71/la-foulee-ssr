export const dominant = '#264A43';
export const tonic = '#DDFF31';
export const white = '#fff';
export const listBorderColor = '#E7E8EA';
// export const APP_BACKGROUND_COLOR = '#F4F5F7';
export const APP_BACKGROUND_COLOR = 'rgba(38, 74, 67, 0.05)';

const themeDominant = {
  dark: '#132531',
  medium: '#4A7069',
  light: '#7DA196',
  extraLight: '#B9CBC6'
};

const themeTonic = {
  darkGrey: '#949493',
  mediumGrey: '#B8B8B7',
  lightGrey: '#DCDDDA',
  pureWhite: '#FFFFFF'
};

const palettes = {
  dominant: themeDominant,
  tonic: themeTonic
};

export const getColor = (color, theme = 'dominant') => palettes[theme][color];
