import pathToRegexp from 'path-to-regexp';

class Route extends React.Component {
  state = {
    match: this.computeMatch(this.props.url)
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      const match = this.computeMatch(nextProps.url);
      this.setState({ match });
    }
  }

  render() {
    if (typeof this.props.children === 'function')
      return this.props.children(this.state.match);

    if (!this.rendered && (!this.state.match || this.props.forceHide))
      return null;

    this.rendered = true;

    return (
      <div
        className={`prevent-scroll  ${
          this.state.match && !this.props.forceHide ? '' : 'wrapper-hidden'
        }`}
        style={{ position: 'relative' }}
      >
        {this.props.children}
      </div>
    );
  }

  rendered = false;
  regexp = null;

  computeMatch(url) {
    if (!this.regexp) {
      let paths = this.props.path;
      if (!Array.isArray(this.props.path)) {
        paths = [this.props.path];
      }

      this.regexp = paths.map(path => pathToRegexp(path));
    }
    return this.regexp.map(re => re.exec(url)).filter(match => match).length;
  }
}

export default Route;
