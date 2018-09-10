import Link from 'next/link';

import { getSpacing, getFontSize } from '../styles-variables';

const FS_ENORMOUS = 100;

const Error = () => (
  <div className={'Error'}>
    <h1>{'Oups !'}</h1>
    <h3>{'La page que vous recherchez semble introuvable.'}</h3>
    <h6>{'Code erreur: 404'}</h6>
    <div className={'ErrorRedirectionMessage'}>
      <p>
        {`Vous pouvez utiliser le lien suivant pour être redirigé:\n`}
        <Link href={'/'}>
          <a>{`Page d'accueil`}</a>
        </Link>
      </p>
    </div>
    <style jsx>{`
      .Error {
        padding: ${getSpacing('m')}px ${getSpacing('s')}px;
      }

      .Error > h1 {
        font-size: ${FS_ENORMOUS}px;
      }

      .ErrorRedirectionMessage > p {
        white-space: pre-line;
      }
    `}</style>
  </div>
);

export default Error;
