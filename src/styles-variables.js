export const Base = 4; // px
export const BaseFontSize = 16; // px
export const BaseRadius = Base; // px
const BaseRatio = 1.125;

// Font sizes

const SFontSize = BaseFontSize / BaseRatio;
const LFontSize = BaseFontSize * BaseRatio;
const XSFontSize = SFontSize / BaseRatio;
const XLFontSize = LFontSize * BaseRatio;
const XXLFontSize = XLFontSize * BaseRatio;

const fontSizeMap = {
  xs: XSFontSize,
  s: SFontSize,
  m: BaseFontSize,
  l: LFontSize,
  xl: XLFontSize,
  xxl: XXLFontSize
};

export const getFontSize = size =>
  !size ? fontSizeMap[`m`] : fontSizeMap[size];

// Line height
export const BaseLineHeight = Base * 6;

// Spacings (margins & paddings)
const BaseSpacing = Base * 6;

const XXSSpacing = BaseSpacing / 6;
const XSSpacing = BaseSpacing / 3;
const SSpacing = BaseSpacing / 2;

const LSpacing = BaseSpacing * 2;
const XLSpacing = BaseSpacing * 3;
const XXLSpacing = BaseSpacing * 6;

const spacingMap = {
  xxs: XXSSpacing,
  xs: XSSpacing,
  s: SSpacing,
  m: BaseSpacing,
  l: LSpacing,
  xl: XLSpacing,
  xxl: XXLSpacing
};

export const getSpacing = size => (!size ? spacingMap[`m`] : spacingMap[size]);

/*
 * Headers
 */

export const H6 = {
  lineHeight: BaseLineHeight,
  fontSize: BaseFontSize, // 16,
  marginTop: BaseSpacing
};

export const H5 = {
  lineHeight: BaseLineHeight,
  fontSize: H6.fontSize * BaseRatio, // 17,72
  marginTop: BaseSpacing
};

export const H4 = {
  lineHeight: BaseLineHeight,
  fontSize: BaseFontSize * Math.pow(BaseRatio, 1), // 19,94
  marginBottom: BaseSpacing,
  marginTop: BaseSpacing
};

export const H3 = {
  lineHeight: BaseLineHeight,
  fontSize: BaseFontSize * Math.pow(BaseRatio, 2), // 22,43
  marginBottom: BaseSpacing,
  marginTop: BaseSpacing
};

export const H2 = {
  lineHeight: BaseLineHeight + Base * 2,
  fontSize: BaseFontSize * Math.pow(BaseRatio, 3), // 25,23
  marginBottom: BaseSpacing,
  marginTop: BaseSpacing
};

export const H1 = {
  lineHeight: BaseLineHeight * 2 - Base,
  fontSize: BaseFontSize * Math.pow(BaseRatio, 4), // 40,39
  marginBottom: LSpacing,
  marginTop: BaseSpacing
};

export const P = {
  marginBottom: BaseLineHeight
};

export const LISTS = {
  marginBottom: BaseLineHeight
};

export const appHeaderSpacing = {
  padding: `${SSpacing} ${BaseSpacing}`
};
