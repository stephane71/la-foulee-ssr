import css from 'styled-jsx/css';

import IconWrapper from './IconWrapper';

// import FacebookIcon from '../svgs/facebook.svg';
// import TwitterIcon from '../svgs/twitter.svg';

import FacebookIcon from '../svgs/facebook-f-brands.svg';
import TwitterIcon from '../svgs/twitter-brands.svg';
import LinkIcon from '../svgs/link-solid.svg';
import WhatsappIcon from '../svgs/whatsapp-brands.svg';
import MailtoIcon from '../svgs/envelope-solid.svg';

import { facebook, twitter, whatsapp, mailto } from '../utils/shareLinks';

import { getSpacing } from '../styles-variables';
import {
  FACEBOOK_SHARE,
  TWITTER_SHARE,
  LINK_SHARE,
  WHATSAPP,
  MAILTO,
  ICON_SIZE
} from '../enums';

function getSharedLink({ dest, url }) {
  switch (dest) {
    case FACEBOOK_SHARE:
      return facebook(url);
    case TWITTER_SHARE:
      return twitter(url);
    case LINK_SHARE:
      return url;
    case WHATSAPP:
      return whatsapp(url);
    case MAILTO:
      return mailto(url);
    default:
      return '';
  }
}

function getImage(dest) {
  switch (dest) {
    case FACEBOOK_SHARE:
      return FacebookIcon;
    case TWITTER_SHARE:
      return TwitterIcon;
    case LINK_SHARE:
      return LinkIcon;
    case WHATSAPP:
      return WhatsappIcon;
    case MAILTO:
      return MailtoIcon;
    default:
      return '';
  }
}

function handleShareWindow(dest, url) {
  window.open(getSharedLink({ dest, url }), 'sharer', 'width=626,height=436');
}

const style = css`
  .Share {
    height: ${ICON_SIZE}px;
    width: ${ICON_SIZE}px;
    margin-right: ${getSpacing('m')}px;
  }

  .Share:hover {
    cursor: pointer;
  }
`;

const Share = ({ dest, url, iconColor }) => {
  const ShareSVG = IconWrapper(getImage(dest));

  return (
    <div className={'Share'} onClick={() => handleShareWindow(dest, url)}>
      <ShareSVG
        fill={iconColor}
        style={{ width: ICON_SIZE, height: ICON_SIZE, verticalAlign: 'top' }}
      />
      <style jsx>{style}</style>
    </div>
  );
};

export default Share;
