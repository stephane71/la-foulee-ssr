import { getSpacing } from '../styles-variables';

const SVGWrapper = ({ icon: Icon, onClick, fill, className }) => (
  <div className={`SVGWrapper ${className} `} onClick={onClick}>
    <Icon style={{ fill: fill, verticalAlign: 'top' }} />
    <style jsx>{`
      .SVGWrapper {
        padding: ${getSpacing('xs')}px;
        display: inline-block;
      }
    `}</style>
  </div>
);

export default SVGWrapper;
