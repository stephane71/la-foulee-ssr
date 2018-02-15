import React from 'react';

import { getSpacing } from '../styles-variables';
import { white, listBorderColor, getColor } from '../colors';
import { BORDER_RADIUS, HEIGHT_APPBAR } from '../enums';

import CrossIcon from '../svgs/ic_close_black_24px.svg';

// to remove
import Button from './Button';

// Enums ??? see: <EventListDate />
const EVENT_LIST_DATE_COLOR = '#F4F5F7';

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

const MobileInput = props => (
  <div className={`mobileInput ${props.hide ? 'out' : 'in'}`}>
    <div className={'mobileInput-content'} onClick={props.onClick}>
      <span className={'mobileInput-placeholder'}>
        {'Rechercher par ville, date, épreuve'}
      </span>
    </div>

    <style jsx>{`
      .mobileInput {
        background-color: ${EVENT_LIST_DATE_COLOR};
        padding: ${getSpacing('xs')}px;
        border: 1px solid ${listBorderColor};

        transition: transform 0.3s ease-out;
        will-change: transform;

        position: absolute;
        top: 56px;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 2;
      }

      .mobileInput-content {
        padding: ${getSpacing('s')}px;
        background-color: ${white};
        border-radius: ${BORDER_RADIUS}px;
        border: 1px solid ${listBorderColor};
      }

      .mobileInput-placeholder {
        text-align: center;
        color: ${getColor('lightGrey', 'tonic')};
      }

      .in {
        transform: translateY(0);
      }

      .out {
        transform: translateY(-100%);
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
          }
        `}</style>
      </div>
    );
  }
}

export default MobileWrapper;
