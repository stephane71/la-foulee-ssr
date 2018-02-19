import React from 'react';

import { getSpacing } from '../styles-variables';
import { white, listBorderColor } from '../colors';
import { HEIGHT_APPBAR } from '../enums';

export class MobileWrapper extends React.PureComponent {
  render() {
    return (
      <div className={`mobileWrapper`}>
        {this.props.children[0]}

        <style jsx>{`
          .mobileWrapper {
            height: 100%;
            position: relative;
          }
        `}</style>
      </div>
    );
  }
}

export default MobileWrapper;
