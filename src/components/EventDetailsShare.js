import css from 'styled-jsx/css';
import getConfig from 'next/config';

import withClipboard from './withClipboard';
import Share from './Share';
import Button from './Button';

import {
  FACEBOOK_SHARE,
  TWITTER_SHARE,
  LINK_SHARE,
  WHATSAPP,
  MAILTO
} from '../enums';
import { getSpacing } from '../styles-variables';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;

const ButtonWithClipboard = withClipboard(Button);
const style = css`
  .EventDetailsShare {
    padding: ${getSpacing('s')}px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .EventDetailsShare--mobile {
    justify-content: space-between;
    max-width: 400px;
  }
`;

const EventDetailsShare = ({ data, path, desktop }) => {
  const url = `${APP_URL}${path}`;

  return (
    <div
      className={`EventDetailsShare ${
        desktop ? '' : 'EventDetailsShare--mobile'
      }`}
    >
      <Share dest={FACEBOOK_SHARE} url={url} margin={false} />
      <Share dest={TWITTER_SHARE} url={url} />
      {!desktop && <Share dest={WHATSAPP} url={url} />}
      <Share dest={MAILTO} url={url} />
      <ButtonWithClipboard theme={'none'} target={`${APP_URL}${path}`}>
        <Share dest={LINK_SHARE} url={url} lockOnClick />
      </ButtonWithClipboard>

      <style jsx>{style}</style>
    </div>
  );
};

export default EventDetailsShare;
