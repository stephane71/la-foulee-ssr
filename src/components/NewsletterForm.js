import React from 'react';
import css from 'styled-jsx/css';

import axios from 'axios';

const style = css`
  .NewsletterForm-Form {
  }

  .NewsletterForm-Label {
    display: block;
  }

  .NewsletterForm-InputText {
  }

  .NewsletterForm-InputSubmit {
  }
`;

export class NewsletterForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit} className={'NewsletterForm-Form'}>
          <label className={'NewsletterForm-Label'}>
            {'Inscrivez-vous à la newsletter !'}
          </label>
          <input
            type={'text'}
            value={this.state.value}
            onChange={this.handleChange}
            placeholder={'e-mail'}
            className={'NewsletterForm-InputText'}
          />

          <input
            type={'submit'}
            value={'Envoyer'}
            className={'NewsletterForm-InputSubmit'}
          />
          <style jsx>{style}</style>
        </form>
      </>
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
  }
}

export default NewsletterForm;
