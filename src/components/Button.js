import ClipboardJS from 'clipboard';

import { getSpacing } from '../styles-variables';

class Button extends React.PureComponent {
  constructor(props) {
    super(props);
    this.button = React.createRef();
  }

  componentDidMount() {
    if (this.props.target) {
      this.button.current.setAttribute(
        'data-clipboard-text',
        this.props.target
      );
      new ClipboardJS('.CopyButton');
    }
  }

  render() {
    const {
      children,
      onClick,
      theme,
      size = 'm',
      marginLeft = false,
      target
    } = this.props;

    return (
      <button
        ref={this.button}
        className={`Button Button-Theme--${theme} Button-Size--${size} ${
          target ? 'CopyButton' : ''
        }`}
        onClick={onClick}
      >
        {children}
        <style jsx>{`
          .Button {
            margin-left: ${marginLeft ? getSpacing('xs') : 0}px;
          }
        `}</style>
      </button>
    );
  }
}

export default Button;
