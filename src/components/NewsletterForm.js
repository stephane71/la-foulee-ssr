import React from 'react';
import css from 'styled-jsx/css';

import { getFontSize, getSpacing } from '../styles-variables';
import { getColor, white } from '../colors';

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
`;

export class NewsletterForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { value: '', sent: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    if (this.state.sent) return <div>{'Merci pour votre inscription !'}</div>;
    return (
      <form onSubmit={this.handleSubmit} className={'NewsletterForm-Form'}>
        <div>
          <input
            type={'text'}
            value={this.state.value}
            onChange={this.handleChange}
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
        <style jsx>{style}</style>
      </form>
    );
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    try {
      await this.props.postNewsletterEmail(this.state.value);
    } catch (e) {
      console.error(e);
    }

    this.setState({ sent: true });
  }
}

export default NewsletterForm;
