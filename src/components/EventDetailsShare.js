import css from 'styled-jsx/css';
import getConfig from 'next/config';
import { withRouter } from 'next/router';

import withClipboard from './withClipboard';
import Share from './Share';
import Button from './Button';

import {
  FACEBOOK_SHARE,
  TWITTER_SHARE,
  WHATSAPP,
  MAILTO,
  ICON_SIZE
} from '../enums';
import { getSpacing } from '../styles-variables';

const { publicRuntimeConfig } = getConfig();
const APP_URL = publicRuntimeConfig.APP_URL;

const DEFAULT_HEIGHT = ICON_SIZE + getSpacing('s') * 2;
const ButtonWithClipboard = withClipboard(Button);

const style = css`
  .EventDetailsShare {
    padding: ${getSpacing('s')}px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: ${DEFAULT_HEIGHT}px;
  }

  .EventDetailsShare-Social {
    flex: 1;
    display: flex;
  }
`;

const EventDetailsShare = ({ data, desktop, isServer, iconColor, router }) => {
  const url = `${APP_URL}${router.asPath}`;

  return (
    <div className={`EventDetailsShare`}>
      <div className={'EventDetailsShare-Social'}>
        <Share dest={FACEBOOK_SHARE} url={url} iconColor={iconColor} />
        <Share dest={TWITTER_SHARE} url={url} iconColor={iconColor} />
        {!isServer &&
          !desktop && <Share dest={WHATSAPP} url={url} iconColor={iconColor} />}
        <Share dest={MAILTO} url={url} iconColor={iconColor} />
      </div>

      <div>
        <ButtonWithClipboard theme={'none'} target={url}>
          {'copier le lien'}
        </ButtonWithClipboard>
      </div>

      <style jsx>{style}</style>
    </div>
  );
};

export default withRouter(EventDetailsShare);
