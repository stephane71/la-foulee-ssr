import React from 'react';

import LogoTonic from '../svgs/lafoulee-glyph-tonic.svg';
import { dominant } from '../colors';

const PRIORITY_INDEX = 100;
const HEIGHT_SPLASH_SCREEN_LOGO = 100;

const SplashScreen = () => (
  <div className={'splashScreen'}>
    <LogoTonic height={`${HEIGHT_SPLASH_SCREEN_LOGO}px`} />

    <style jsx>{`
      .splashScreen {
        z-index: ${PRIORITY_INDEX};
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: ${dominant};
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
);

export default SplashScreen;
