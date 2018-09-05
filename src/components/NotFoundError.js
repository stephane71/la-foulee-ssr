import React from 'react';
import GlyphLaFoulee from '../svgs/lafoulee-glyph-tonic.svg';

import { getSpacing } from '../styles-variables';
import { dominant, white } from '../colors';

const NotFoundError = ({ title }) => (
  <div className={'NotFoundError'}>
    <h1 className={'NotFoundError-Header'}>{title}</h1>

    <GlyphLaFoulee />

    <style jsx>{`
      .NotFoundError {
        height: 100%;
        padding: ${getSpacing('m')}px;
        padding-top: ${getSpacing('xl')}px;
        text-align: center;
        background-color: ${dominant};
      }

      .NotFoundError-Header {
        margin-top: 0;
        font-family: 'Circular-Medium';
        color: ${white};
      }
    `}</style>
  </div>
);

export default NotFoundError;
