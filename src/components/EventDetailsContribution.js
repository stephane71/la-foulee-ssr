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

  .EventDetailsContribution-Label {
    font-weight: 600;
  }

  .EventDetailsContribution-Textarea {
    width: 100%;
    height: 100px;
    font-size: ${getFontSize()}px;
    outline: none;
    border: 0;
    resize: none;
    margin-top: ${getSpacing("s")}px;
    background-color: ${APP_BACKGROUND_COLOR};
    border-radius: ${BORDER_RADIUS}px;
    padding: ${getSpacing("s")}px;
  }

  .EventDetailsContribution-ThxsMessage {
    margin-left: ${getSpacing("m")}px;
  }
`;

const { className: classNameButton, styles: styleButton } = css.resolve`
  button {
    margin-top: ${getSpacing("s")}px;
  }
`;

class EventDetailsContribution extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contribution: "",
      cleared: false
    };

    this.textarea = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleOpenPost = this.handleOpenPost.bind(this);
    this.handleSubmitContribution = this.handleSubmitContribution.bind(this);
  }

  render() {
    const { cleared } = this.state;
    const { iconColor } = this.props;

    return (
      <div className={"EventDetailsContribution"}>
        <form onSubmit={this.handleSubmitContribution}>
          <label onClick={this.handleOpenPost}>
            <span className={"EventDetailsContribution-Label"}>
              {"Proposer des modifications de l'événement"}
            </span>
            <textarea
              ref={this.textarea}
              value={this.state.contribution}
              onChange={this.handleChange}
              className={"EventDetailsContribution-Textarea"}
              placeholder={"ex: Le 10km commence à 10h pas à 9h ..."}
            />
          </label>

          <Button
            type={"submit"}
            size={"s"}
            theme={"inline"}
            className={classNameButton}
          >
            {"Envoyer"}
          </Button>
          {cleared && (
            <span className={"EventDetailsContribution-ThxsMessage"}>
              {"Merci !"}
            </span>
          )}
        </form>

        {styleButton}
        <style jsx>{style}</style>
      </div>
    );
  }

  handleChange(event) {
    this.setState({ contribution: event.target.value });
  }

  handleOpenPost() {
    this.textarea.current.focus();
  }

  handleSubmitContribution(e) {
    e.preventDefault();
    const contribution = this.state.contribution.trim();
    if (!contribution) return;
    this.props.onSubmitContribution(contribution);
    this.setState({ contribution: "", cleared: true });

    setTimeout(() => this.setState({ cleared: false }), 2000);
  }
}

export default EventDetailsContribution;
