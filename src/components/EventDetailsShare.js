import css from 'styled-jsx/css';
import getConfig from 'next/config';

import withClipboard from './withClipboard';
import Share from './Share';
import Button from './Button';

import { FACEBOOK_SHARE, TWITTER_SHARE } from '../enums';
import { getSpacing } from '../styles-variables';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;

const ButtonWithClipboard = withClipboard(Button);

const style = css`
  .EventDetailsShare {
    padding: ${getSpacing('s')}px 0;
    display: flex;
    flex-direction: row;
  }
`;

const EventDetailsShare = ({ data, path }) => (
  <div className={'EventDetailsShare'}>
    <Share dest={FACEBOOK_SHARE} url={`${APP_URL}${path}`} margin={false} />
    <Share dest={TWITTER_SHARE} url={`${APP_URL}${path}`} />
    <ButtonWithClipboard
      theme={'light'}
      size={'s'}
      marginLeft
      target={`${APP_URL}${path}`}
    >
      {'Copier le lien'}
    </ButtonWithClipboard>

    <style jsx>{style}</style>
  </div>
);

export default EventDetailsShare;
