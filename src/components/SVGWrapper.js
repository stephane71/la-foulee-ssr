import { getSpacing } from '../styles-variables';

const SVGWrapper = ({ icon: Icon, onClick }) => (
  <div className={'withSVGWrapper'} onClick={onClick}>
    <Icon style={{ verticalAlign: 'middle' }} />
    <style jsx>{`
      .withSVGWrapper {
        padding: ${getSpacing('xs')}px ${getSpacing('s')}px;
        display: inline-block;
      }
    `}</style>
  </div>
);

export default SVGWrapper;
