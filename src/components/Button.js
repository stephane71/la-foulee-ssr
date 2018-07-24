import { getSpacing } from '../styles-variables';

class Button extends React.PureComponent {
  render() {
    const {
      children,
      onClick,
      theme,
      size,
      marginLeft = false,
      forwardedRef
    } = this.props;

    const buttonSize = size ? `Button-Size--${size}` : '';
    return (
      <button
        ref={forwardedRef}
        className={`Button Button-Theme--${theme} ${buttonSize}`}
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

export default React.forwardRef((props, ref) => {
  return <Button {...props} forwardedRef={ref} />;
});
