import React from 'react';
import css from 'styled-jsx/css';

import { getFontSize, getSpacing } from '../styles-variables';
import { getColor, white, dominant } from '../colors';

function getErrorMessage(error) {
  if (error === NO_EMAIL) return 'Un email doit être fourni';
  if (error === INVALID_FORMAT)
    return `Le format de cet e-mail n'est pas valide`;
}

// Server Errors
const NO_EMAIL = 'EmailNotFound';
const INVALID_FORMAT = 'InvalidFormat';

const style = css`
  .NewsletterForm-Form {
    display: flex;
  }

  .NewsletterForm-Form > div:first-child {
    width: 100%;
  }

  .NewsletterForm-InputText {
    outline: 0;
    text-decoration: none;
    border: none;
    font-size: ${getFontSize('s')}px;
    padding: ${getSpacing('s')}px ${getSpacing('m')}px;
    margin: 0;
    border-right: 1px solid ${getColor('darkGrey', 'tonic')};
    width: 100%;
  }

  .NewsletterForm-InputSubmit {
    background-color: ${getColor('medium')};
    color: ${white};
    font-size: ${getFontSize('s')}px;
    padding: ${getSpacing('s')}px ${getSpacing('m')}px;
    border: none;
    cursor: pointer;
    margin: 0;
  }

  .NewsletterForm-ErrorMessage {
    color: ${dominant};
  }
`;

export class NewsletterForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { value: '', sent: false, error: null };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  render() {
    if (this.state.sent && !this.state.error)
      return <div>{'Merci pour votre inscription !'}</div>;

    return (
      <div className={'NewsletterForm'}>
        <form onSubmit={this.handleSubmit} className={'NewsletterForm-Form'}>
          <div>
            <input
              type={'email'}
              required={'required'}
              value={this.state.value}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              placeholder={'E-MAIL'}
              className={'NewsletterForm-InputText'}
            />
          </div>
          <div>
            <input
              type={'submit'}
              value={'Envoyer'}
              className={'NewsletterForm-InputSubmit'}
            />
          </div>
        </form>
        <div className={'NewsletterForm-ErrorMessage'}>
          {this.state.error ? getErrorMessage(this.state.error) : null}
        </div>
        <style jsx>{style}</style>
      </div>
    );
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleFocus(event) {
    if (this.state.sent) this.setState({ sent: false, error: null });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let error = null;

    try {
      await this.props.postNewsletterEmail(this.state.value);
    } catch (e) {
      if (e.response.status === 400) {
        error = e.response.data.code;
      }
    }

    this.setState({ sent: true, error });
  }
}

export default NewsletterForm;
