import { getSpacing } from '../styles-variables';

const SVGWrapper = ({ icon: Icon, onClick, fill }) => (
  <div className={'SVGWrapper'} onClick={onClick}>
    <Icon style={{ fill: fill, verticalAlign: 'middle' }} />
    <style jsx>{`
      .SVGWrapper {
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        display: inline-block;
      }
    `}</style>
  </div>
);

export default SVGWrapper;
