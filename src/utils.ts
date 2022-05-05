import axios from 'axios';
import log from "loglevel";
import config from './config/app.config';

export const getContent = async (path) => {
  const url = `${config().contentApi.uri}${path}`;

  return axios
    .get(url)
    .then(handleResponse)
    .catch((error) => {
      handleError(error);
      throw new Error(error);
    });
};

export async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response;
  } else {
    throw new Error('failed');
  }
}

export function handleError(error) {
  if (error.response) {
    // client received an error response (5xx, 4xx)
    log.error({
      error: error.response.data,
      //requestUrl: error.response.request.responseURL,
      status: error.response.status,
      headers: error.response.headers,
    });
  } else if (error.request) {
    // client never received a response, or request never left
    log.error({ error: error.request });
  } else {
    // anything else
    log.error({ error: error.message });
  }
}

export const parseToken = (token: string) => {
  const obj = {
    userId: null,
    sessionId: null,
    expiration: null,
    clientIp: null,
  };

  const arr = token.split('&');
  arr.forEach(element => {
    const keyValue = element.split('=');
    obj[keyValue[0]] = keyValue[1];
  });

  return obj;
};
