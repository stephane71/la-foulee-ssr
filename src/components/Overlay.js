import { HEIGHT_APPBAR } from '../enums';

const Overlay = ({ show, onClick, headerPadding }) => (
  <div
    className={`Overlay ${show ? 'Overlay-show' : 'Overlay-hide'}`}
    onClick={onClick}
  >
    <style jsx>{`
      .Overlay {
        position: fixed;
        top: ${headerPadding ? HEIGHT_APPBAR : 0}px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        // transition: opacity 0.3s ease-out;
        z-index: -1;
      }

      .Overlay-hide {
        opacity: 0;
      }

      .Overlay-show {
        opacity: 1;
        z-index: 100;
      }
    `}</style>
  </div>
);

export default Overlay;
