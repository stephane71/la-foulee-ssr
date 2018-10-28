import css from "styled-jsx/css";
import debounce from "lodash.debounce";

import buildGoogleMapStaticImage from "../utils/buildGoogleMapStaticImage";

import { BORDER_RADIUS } from "../enums";

const style = css`
  .StaticMap-Image {
    width: 100%;
    height: 100%;
    border-radius: ${BORDER_RADIUS}px;
  }
`;

class StaticMap extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mapWidth: null
    };

    this.mapContainerRef = React.createRef();
    this.handleResize = this.handleResize.bind(this);
    this.handleResize = debounce(this.handleResize, 100);
  }

  componentDidMount() {
    this.setState({ mapWidth: this.mapContainerRef.current.clientWidth });

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    const { event, desktop, color, dimensions } = this.props;
    const { mapWidth } = this.state;

    let { width = null, height } = dimensions;
    width = width || mapWidth;

    return (
      <div ref={this.mapContainerRef} className={"StaticMap"}>
        {mapWidth && (
          <img
            className={"StaticMap-Image"}
            src={buildGoogleMapStaticImage(event, { width, height }, desktop)}
          />
        )}

        <style jsx>{style}</style>
        <style jsx>{`
          .StaticMap {
            height: ${height}px;
            width: 100%;
            border-radius: ${BORDER_RADIUS}px;
            background-color: ${color};
          }
        `}</style>
      </div>
    );
  }

  handleResize() {
    if (this.mapContainerRef.current)
      this.setState({ mapWidth: this.mapContainerRef.current.clientWidth });
  }
}

export default StaticMap;
