import css from 'styled-jsx/css';

import { getFontSize } from '../styles-variables';
import { white } from '../colors';

const style = css`
  .inputWrapper {
    width: 100%;
  }

  .inputElement {
    width: 100%;
    appearence: none;
    outline: 0;
    text-decoration: none;
    border: none;
    text-transform: capitalize;
    font-size: ${getFontSize('s')}px;
    background-color: transparent;
    color: ${white};
  }
`;

const DEFAULT_VALUE = '';

const KEYBOARD_ENTER = 13;
const KEYBOARD_UP = 38;
const KEYBOARD_DOWN = 40;

export const KEYBOARD_NAV_UP = 'up';
export const KEYBOARD_NAV_DOWN = 'down';

class Input extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { value: props.value || DEFAULT_VALUE };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputWrapperClick = this.handleInputWrapperClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.handleInputWrapperClick();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.reset !== nextProps.reset && nextProps.reset) {
      this.setState({ value: DEFAULT_VALUE });
      this.textInput.focus();
    }
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value || DEFAULT_VALUE });
    }
    if (!this.props.focus && nextProps.focus) {
      this.textInput.focus();
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
          onKeyDown={this.handleKeyDown}
        />
        <style jsx>{style}</style>
      </div>
    );
  }

  handleInputWrapperClick() {
    this.textInput.focus();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onChange(event.target.value);
  }

  handleKeyDown(event) {
    if (event.keyCode === KEYBOARD_ENTER) {
      this.props.onKeyboardValidation();
    }
    if (event.keyCode === KEYBOARD_UP) {
      this.props.onKeyboardNavigation(KEYBOARD_NAV_UP);
    }
    if (event.keyCode === KEYBOARD_DOWN) {
      this.props.onKeyboardNavigation(KEYBOARD_NAV_DOWN);
    }
  }
}

export default Input;
