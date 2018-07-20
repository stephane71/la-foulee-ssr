import Facebook from '../svgs/facebook.svg';
import Twitter from '../svgs/twitter.svg';

import { facebook, twitter } from '../utils/shareLinks';

import { getSpacing } from '../styles-variables';
import { FACEBOOK_SHARE, TWITTER_SHARE } from '../enums';

function getSharedLink({ dest, url }) {
  switch (dest) {
    case FACEBOOK_SHARE:
      return facebook(url);
    case TWITTER_SHARE:
      return twitter(url);
    default:
      return '';
  }
}

function getImage(dest) {
  switch (dest) {
    case FACEBOOK_SHARE:
      return Facebook;
    case TWITTER_SHARE:
      return Twitter;
    default:
      return '';
  }
}

function handleShareWindow(dest, url) {
  window.open(getSharedLink({ dest, url }), 'sharer', 'width=626,height=436');
}

const ICON_SIZE = 42;

const Share = ({ dest, url, margin = true }) => {
  const ShareSVG = getImage(dest);

  return (
    <div className={'Share'} onClick={() => handleShareWindow(dest, url)}>
      <ShareSVG />
      <style jsx>{`
        .Share {
          height: ${ICON_SIZE}px;
          width: ${ICON_SIZE}px;
          margin-left: ${margin ? getSpacing('xs') : 0}px;
        }

        .Share:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Share;
