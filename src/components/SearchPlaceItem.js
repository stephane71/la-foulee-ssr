class SearchPlaceItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.placeRef = React.createRef();
  }

  componentDidMount() {
    this.placeRef.current.innerHTML = this.buildValue(this.props.prediction);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.prediction !== this.props.prediction) {
      this.placeRef.current.innerHTML = this.buildValue(nextProps.prediction);
    }
  }

  render() {
    return <div ref={this.placeRef} className={"SearchPlaceItem"} />;
  }

  buildValue = prediction =>
    `${prediction.match}  <span>${prediction.county}</span>`;
}

export default SearchPlaceItem;
