import { Response } from 'express';
import { cancellableRequestType } from './cancellable-requests.d';
import { cancellableRequestGet } from './cancellable-requests';

const ROOT_URL = 'https://api.nasa.gov';

const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

export default class NasaAPIHandler {
  constructor() {
    if (API_KEY === 'DEMO_KEY') {
      console.warn('Using demo API key. Please set your own NASA API key in the environment variable NASA_API_KEY.');
    }
  }

  _getURL = (endpoint, options = {}): string => {
    const url = new URL(endpoint, ROOT_URL);

    for (const [key, value] of Object.entries(options)) {
      url.searchParams.append(key, String(value));
    }
    return url.href;
  };

  _logRateLimitHeaders = (res: Response): Response => {
    console.log(
      `Rate Limit Headers: X-RateLimit-Limit=${res.getHeader('X-RateLimit-Limit')}, X-RateLimit-Remaining=${res.getHeader('X-RateLimit-Remaining')}`,
    );
    return res;
  };

  getPhotoOfTheDay = (): cancellableRequestType => {
    try {
      const url = this._getURL('/planetary/apod', { api_key: API_KEY });

      // .then(this._logRateLimitHeaders);
      return cancellableRequestGet(url);
    } catch (err) {
      console.error(err);
      return {
        responsePromise: Promise.reject('error'),
        cancelRequest: () => {},
      };
    }
  };
}
