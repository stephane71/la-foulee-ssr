import css from 'styled-jsx/css';

import { getFontSize } from '../styles-variables';

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
  }
`;

const DEFAULT_VALUE = '';

class Input extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { value: props.value || DEFAULT_VALUE };

    this.handleChange = this.handleChange.bind(this);
    this.handleInputWrapperClick = this.handleInputWrapperClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
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
}

export default Input;
