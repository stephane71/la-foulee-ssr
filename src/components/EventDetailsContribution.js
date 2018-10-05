import React from "react";
import css from "styled-jsx/css";

import Button from "./Button";

import { getSpacing, getFontSize } from "../styles-variables";
import { BORDER_RADIUS } from "../enums";
import { getColor } from "../colors";

const style = css`
  .EventDetailsContribution {
  }

  .EventDetailsContribution-PostContainer {
    padding: ${getSpacing("m")}px;
    border-radius: ${BORDER_RADIUS}px;
    cursor: text;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 10px;
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
      <div className={"EventDetailsContribution"}>
        {/* <h2>{"Des informations sont incorrectes ou manquantes ?"}</h2> */}

        <div
          className={"EventDetailsContribution-PostContainer"}
          onClick={this.handleOpenPost}
        >
          <div className={"EventDetailsContribution-PostHeader"}>
            <div>{"Envoyez vos modifications !"}</div>
            {/* <span>{event.title}</span> */}
          </div>
          <div>
            <textarea
              ref={this.textarea}
              className={"EventDetailsContribution-Textarea"}
              placeholder={"Ecrivez ici..."}
            />
            <div>
              <Button size={"s"} theme={"inline"}>
                {"Envoyer les modifications"}
              </Button>
            </div>
          </div>
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
