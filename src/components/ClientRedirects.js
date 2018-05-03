import Router, { withRouter } from 'next/router';

const ClientRedirects = ({ position, router }) => {
  if (router.asPath === '/search' && !position) Router.replace('/', '/');
  return null;
};

export default withRouter(ClientRedirects);
