import axios from 'axios';
import css from 'styled-jsx/css';
import getConfig from 'next/config';

import { getSpacing } from '../styles-variables';

const { publicRuntimeConfig } = getConfig();
const GIPHY_KEY = publicRuntimeConfig.GIPHY_KEY;

const styleLayoutError = css`
  .LayoutError {
    padding: ${getSpacing('m')}px;
    text-align: center;
  }

  .LayoutError-Image {
    max-width: 100%;
    min-width: 70%;
    max-height: 50%;
  }
`;

const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/random?tag=sorry&rating=r';

// Prevent Network problem by fetch a default gif from server
class LayoutError extends React.PureComponent {
  state = {
    gifUrl: null
  };

  componentDidMount() {
    axios
      .get(`${GIPHY_API_URL}&api_key=${GIPHY_KEY}`)
      .then(({ data }) => data)
      .then(({ data }) => this.setState({ gifUrl: data.image_original_url }));
  }

  render() {
    const { gifUrl } = this.state;

    return (
      <div className={'LayoutError'}>
        <p>{'Un problème est apparu, je mets toute mon équipe sur le coup!'}</p>
        {gifUrl && <img src={gifUrl} className={'LayoutError-Image'} />}
        <style jsx>{styleLayoutError}</style>
      </div>
    );
  }
}

export default LayoutError;
