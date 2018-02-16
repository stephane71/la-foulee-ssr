import React from 'react';

import { getSpacing } from '../styles-variables';
import { white, listBorderColor } from '../colors';
import { HEIGHT_APPBAR } from '../enums';

import CrossIcon from '../svgs/ic_close_black_24px.svg';

import MobileInput from './MobileInput';
// to remove
import Button from './Button';

const MobileFilters = props => (
  <div className={'mobileFilters'}>
    <header className={'mobileFilters-header'}>
      <CrossIcon onClick={props.onClose} />
      <span className={'mobileFilters-headerTitle'}>{'Filtres'}</span>
    </header>
    <div className={'mobileFilters-selectors'}>{props.children}</div>
    <style jsx>{`
      .mobileFilters {
        width: 100vw;
        height: 100%;
      }

      .mobileFilters-header {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        background-color: ${white};
        z-index: 10;

        height: ${HEIGHT_APPBAR}px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: ${getSpacing('s')}px;
        border-bottom: 1px solid ${listBorderColor};
      }

      .mobileFilters-headerTitle {
        margin-left: ${getSpacing('xs')}px;
      }

      .mobileFilters-selectors {
        padding: ${getSpacing('m')}px 0;
        height: calc(100% - ${HEIGHT_APPBAR}px);
      }
    `}</style>
  </div>
);

export class MobileWrapper extends React.PureComponent {
  state = {
    showFilters: false
  };

  render() {
    let { showFilters } = this.state;
    if (showFilters) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return (
      <div className={`mobileWrapper`}>
        <div className={`${showFilters ? 'wrapper-hidden' : 'wrapper-show'}`}>
          {/* <MobileInput onClick={() => this.setState({ showFilters: true })} /> */}
          <MobileInput
            onClick={() => this.setState({ showFilters: true })}
            hide={this.props.isScrolling}
          />
          {this.props.children[0]}
        </div>

        <div className={`${showFilters ? 'wrapper-show' : 'wrapper-hidden'}`}>
          <MobileFilters
            show={showFilters}
            onClose={() => this.setState({ showFilters: false })}
          >
            {this.props.children[1]}
          </MobileFilters>
        </div>

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
