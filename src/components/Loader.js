import { getSpacing } from '../styles-variables';
import { dominant, white } from '../colors';

const factors = {
  s: 2,
  m: 4
};

function getFactor(size) {
  return size ? factors[size] : factors[`m`];
}

const Loader = props => {
  let factor = getFactor(props.size);
  return (
    <div className={'spinner-wrapper'} style={{ ...props.style }}>
      <div className={'spinner'} />
      <style jsx>{`
        @keyframes rotate360 {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .spinner-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${getSpacing('m')}px;
          user-select: none;
          height: 100%;
        }

        .spinner {
          display: inline-block;
          width: ${factor * 10}px;
          height: ${factor * 10}px;
          border: ${factor}px solid ${dominant};
          border-top-color: transparent;
          border-radius: 50%;
          animation: rotate360 0.75s linear infinite;
          cursor: progress;
        }
      `}</style>
    </div>
  );
};

export default Loader;
