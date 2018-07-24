import ClipboardJS from 'clipboard';

import { getSpacing } from '../styles-variables';
import { getColor, white } from '../colors';
import { BORDER_RADIUS, HEIGHT_APPBAR } from '../enums';

const InfoCopied = () => (
  <div className={'InfoCopied InfoCopied-Layout'}>
    {'Lien copié'}
    <style jsx>{`
      .InfoCopied {
        padding: ${getSpacing('xs')}px;
        background-color: ${getColor('darkGrey', 'tonic')};
        color: ${white};
        border-radius: ${BORDER_RADIUS}px;
        // animation: 0.1s linear appear;
      }

      .InfoCopied-Layout {
        position: fixed;
        top: ${HEIGHT_APPBAR + 10}px;
        left: 50%;
        transform: translateX(-50%);
      }

      @keyframes appear {
        from {
          bottom: 30%;
        }
        to {
          bottom: 50%;
        }
      }
    `}</style>
  </div>
);

function withClipboard(Button) {
  return class Clipboard extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        copied: false
      };

      this.button = React.createRef();
    }

    componentDidMount() {
      this.clipboard = new ClipboardJS(this.button.current, {
        text: () => this.props.target
      });

      this.clipboard.on('success', e => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 1000);
      });
    }

    render() {
      return (
        <>
          {this.state.copied && <InfoCopied />}
          <Button ref={this.button} {...this.props} />
        </>
      );
    }
  };
}

export default withClipboard;
