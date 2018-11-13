import css from "styled-jsx/css";
import dynamic from "next/dynamic";

const VirtualizedList = dynamic(import("./VirtualizedList"), {
  loading: () => null,
  ssr: false
});

import Loader from "./Loader";
import EventListHeader from "./EventListHeader";

import { getSpacing, BaseLineHeight } from "../styles-variables";
import { HEIGHT_APPBAR, MAX_WIDTH } from "../enums";

// See EventListDate component: line height + 2 * vertical padding
const EVENT_LIST_DATE_HEIGHT = BaseLineHeight + 2 * getSpacing("m");

const style = css`
  .EventList {
  }

  .EventList-Loading {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: ${MAX_WIDTH}px;
    z-index: 10;
    background-color: transparent;
  }

  .EventList-Empty {
    text-align: center;
    padding: ${getSpacing("xxl")}px ${getSpacing("l")}px;
  }
`;

class EventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listRendering: true
    };

    this.handleEventSelection = this.handleEventSelection.bind(this);
    this.handleListRendering = this.handleListRendering.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && this.props.loading) {
      this.setState({ listRendering: false });
    }
  }

  render() {
    const { data, loading, place } = this.props;
    const { listRendering } = this.state;

    const showLoader = listRendering || loading;

    return (
      <div className={"EventList"}>
        {showLoader && (
          <div className={"EventList-Loading"}>
            <Loader />
          </div>
        )}

        <EventListHeader nbItems={data.length} city={place} />

        {!data.length && !showLoader ? (
          <div
            className={"EventList-Empty"}
          >{`Aucun événements n'a été trouvé dans cette zone :(`}</div>
        ) : (
          <VirtualizedList
            data={data}
            onSelectEvent={this.handleEventSelection}
            onListRendering={this.handleListRendering}
          />
        )}

        <style jsx>{style}</style>
      </div>
    );
  }

  handleEventSelection(data, elementPosition) {
    this.props.onSelectEvent(data);
  }

  handleListRendering(rendering) {
    this.setState({ listRendering: rendering });
  }
}

export default EventList;
