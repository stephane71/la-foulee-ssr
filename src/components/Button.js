import { getSpacing } from '../styles-variables';

class Button extends React.PureComponent {
  render() {
    const {
      children,
      onClick,
      theme,
      size = 'm',
      marginLeft = false,
      forwardedRef
    } = this.props;

    return (
      <button
        ref={forwardedRef}
        className={`Button Button-Theme--${theme} Button-Size--${size}`}
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

// export default Button;
export default React.forwardRef((props, ref) => {
  return <Button {...props} forwardedRef={ref} />;
});
