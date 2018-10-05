import { getSpacing } from "../styles-variables";

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

    const buttonSize = size ? `Button-Size--${size}` : "";
    const buttonTheme = theme ? `Button-Theme--${theme}` : "";

    return (
      <button
        ref={forwardedRef}
        className={`Button ${buttonTheme} ${buttonSize}`}
        onClick={onClick}
      >
        {children}
        <style jsx>{`
          .Button {
            margin-left: ${marginLeft ? getSpacing("xs") : 0}px;
          }
        `}</style>
      </button>
    );
  }
}

export default React.forwardRef((props, ref) => {
  return <Button {...props} forwardedRef={ref} />;
});
