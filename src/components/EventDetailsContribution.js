import React from "react";
import css from "styled-jsx/css";

import Button from "./Button";

import { getSpacing, getFontSize } from "../styles-variables";
import { BORDER_RADIUS } from "../enums";
import { APP_BACKGROUND_COLOR } from "../colors";

const style = css`
  .EventDetailsContribution {
    cursor: text;
  }

  .EventDetailsContribution-PostHeader {
    font-weight: 600;
  }

  .EventDetailsContribution-Textarea {
    width: 100%;
    height: 150px;
    font-size: ${getFontSize()}px;
    outline: none;
    border: 0;
    resize: none;
    margin-top: ${getSpacing("s")}px;
    background-color: ${APP_BACKGROUND_COLOR};
    border-radius: ${BORDER_RADIUS}px;
    padding: ${getSpacing("s")}px;
  }

  .EventDetailsContribution-Submit {
    margin-top: ${getSpacing("s")}px;
  }
`;

class EventDetailsContribution extends React.Component {
  constructor(props) {
    super(props);

    this.textarea = React.createRef();

    this.handleOpenPost = this.handleOpenPost.bind(this);
  }

  render() {
    const { event, iconColor } = this.props;

    return (
      <div className={"EventDetailsContribution"} onClick={this.handleOpenPost}>
        <div className={"EventDetailsContribution-PostHeader"}>
          {"Envoyez vos modifications !"}
        </div>
        <textarea
          ref={this.textarea}
          className={"EventDetailsContribution-Textarea"}
          placeholder={"Ecrivez ici..."}
        />
        <div className={"EventDetailsContribution-Submit"}>
          <Button size={"s"} theme={"inline"}>
            {"Envoyer"}
          </Button>
        </div>

        <style jsx>{style}</style>
      </div>
    );
  }

  handleOpenPost() {
    this.textarea.current.focus();
  }
}

export default EventDetailsContribution;
