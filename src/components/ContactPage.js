import { getSpacing } from '../styles-variables';

const ContactPage = () => (
  <div className={'ContactPage'}>
    <h1>{'Contactez-nous'}</h1>
    <div className={'ContactPage-content'} />
    <style jsx>{`
      .ContactPage {
        padding: ${getSpacing('m')}px;
      }
    `}</style>
  </div>
);

export default ContactPage;
