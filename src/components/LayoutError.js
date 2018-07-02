import axios from 'axios';
import css from 'styled-jsx/css';
import getConfig from 'next/config';

import { getSpacing } from '../styles-variables';
import {
  UNKNOWN_ERROR,
  PERMISSION_DENIED,
  POSITION_UNAVAILABLE,
  TIMEOUT
} from '../enums';

const { publicRuntimeConfig } = getConfig();
const GIPHY_KEY = publicRuntimeConfig.GIPHY_KEY;

const ERROR_TO_TAG = {
  [UNKNOWN_ERROR]: 'sorry',
  [PERMISSION_DENIED]: 'rejected',
  [POSITION_UNAVAILABLE]: 'sorry',
  [TIMEOUT]: 'sorry'
};

const GLOBAL_ERROR_MESSAGE =
  'Un problème est apparu, nous allons faire le maximum pour le corriger!';
const ERROR_TO_MESSAGE = {
  [UNKNOWN_ERROR]: GLOBAL_ERROR_MESSAGE,
  [PERMISSION_DENIED]: `Vous n'avez pas autoriser La Foulée à accéder à votre position !`,
  [POSITION_UNAVAILABLE]: GLOBAL_ERROR_MESSAGE,
  [TIMEOUT]: GLOBAL_ERROR_MESSAGE
};

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
    const req = this.getRequest(this.props.error);
    if (req)
      axios
        .get(req)
        .then(({ data }) => data)
        .then(({ data }) => this.setState({ gifUrl: data.image_url }));
  }

  render() {
    const { gifUrl } = this.state;

    return (
      <div className={'LayoutError'}>
        <p>{ERROR_TO_MESSAGE[this.props.error]}</p>
        {gifUrl && <img src={gifUrl} className={'LayoutError-Image'} />}
        <style jsx>{styleLayoutError}</style>
      </div>
    );
  }

  getRequest(error) {
    const tag = ERROR_TO_TAG[error];
    return `${GIPHY_API_URL}&api_key=${GIPHY_KEY}&tag=${tag}`;
  }
}

export default LayoutError;
