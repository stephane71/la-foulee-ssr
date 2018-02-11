// should not be added !
// when using babel-plugin-inline-react-svg (added for project) && babel-plugin-react-require (added from next.js)
// read here https://github.com/kesne/babel-plugin-inline-react-svg/issues/31#issuecomment-342264348
import React from 'react';
import css from 'styled-jsx/css';

import { getSpacing, BaseFontSize } from '../styles-variables';
import { listBorderColor, getColor } from '../colors';

import Arrow from '../svgs/arrow_down_black_24px.svg';

const style = css`
  .inputWrapper {
    border: 1px solid ${listBorderColor};
    border-radius: 5px;
    padding: ${getSpacing('xxs')}px ${getSpacing('s')}px;
    display: flex;
    align-items: center;
  }

  .inputElement {
    width: 100%;
    appearence: none;
    outline: 0;
    text-decoration: none;
    border: none;
    text-transform: capitalize;
    font-size: ${BaseFontSize}px;
  }
`;

class Input extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputWrapperClick = this.handleInputWrapperClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    return (
      <div className={'inputWrapper'} onClick={this.handleInputWrapperClick}>
        <input
          ref={input => {
            this.textInput = input;
          }}
          placeholder={this.props.placeholder}
          className={'inputElement'}
          type={'text'}
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.props.onBlur}
        />
        <Arrow style={{ fill: getColor('darkGrey', 'tonic') }} />
        <style jsx>{style}</style>
      </div>
    );
  }

  handleInputWrapperClick() {
    this.textInput.focus();
    this.props.onFocus();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onChange(event.target.value);
  }
}

export default Input;
