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
    this.handleSubmitContribution = this.handleSubmitContribution.bind(this);
  }

  render() {
    const { event, iconColor } = this.props;

    return (
      <div className={"EventDetailsContribution"} onClick={this.handleOpenPost}>
        <div className={"EventDetailsContribution-PostHeader"}>
          {"Proposer des modifications de l'événement"}
        </div>
        <textarea
          ref={this.textarea}
          className={"EventDetailsContribution-Textarea"}
          placeholder={"ex: Le 10km commence à 10h pas à 9h ..."}
        />
        <div className={"EventDetailsContribution-Submit"}>
          <Button
            size={"s"}
            theme={"inline"}
            onClick={this.handleSubmitContribution}
          >
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

  handleSubmitContribution() {
    const contribution = this.textarea.current.value;
    this.props.onSubmitContribution(contribution);
  }
}

export default EventDetailsContribution;
