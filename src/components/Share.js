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
  MAILTO
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

// Based on the height of the button ButtonWithClipboard
// see EventDetailsShare component
const ICON_SIZE = 42;
export const SHARE_ICON_HEIGHT = ICON_SIZE + getSpacing('xs');

const Share = ({ dest, url, margin = true, lockOnClick }) => {
  const ShareSVG = getImage(dest);

  const onClick = lockOnClick
    ? {}
    : { onClick: () => handleShareWindow(dest, url) };

  return (
    <div className={'Share'} {...onClick}>
      <ShareSVG height={'100%'} width={'100%'} />
      <style jsx>{`
        .Share {
          height: ${ICON_SIZE}px;
          width: ${ICON_SIZE}px;
          margin-left: ${margin ? getSpacing('xs') : 0}px;
          padding: ${getSpacing('xs')}px;
        }

        .Share:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Share;
