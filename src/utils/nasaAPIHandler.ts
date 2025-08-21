import { Response } from 'express';
// import { cancellableRequestType } from './cancellable-requests.d';
import { cancellableRequestGetClass } from './cancellable-requests';

import { type PhotoOfTheDayResponse, type PhotoOfTheDay } from 'common-files';

const ROOT_URL = 'https://api.nasa.gov';

const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

interface PhotoOfTheDayQuery {
  date?: string;
  start_date?: string;
  end_date?: string;
}
export default class NasaAPIHandler {
  constructor() {
    if (API_KEY === 'DEMO_KEY') {
      console.warn('Using demo API key. Please set your own NASA API key in the environment variable NASA_API_KEY.');
    }
  }

  // move to common utils
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

  verifyDate(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  validatePOTDParams(query: PhotoOfTheDayQuery): boolean {
    if (query.date) {
      if (query.start_date || query.end_date) {
        return false;
      }
      return this.verifyDate(query.date);
    }
    if (query.start_date || query.end_date) {
      if (query.start_date && query.end_date) {
        return this.verifyDate(query.start_date) && this.verifyDate(query.end_date);
      }
      return false;
    }
    return true;
  }

  _transformPOTDResponse = (POTD: PhotoOfTheDayResponse): PhotoOfTheDay => ({
    title: POTD.title,
    explanation: POTD.explanation,
    date: POTD.date,
    HDURL: POTD.hdurl,
    imageURL: POTD.url,
    copyright: POTD.copyright,
  });

  getPhotoOfTheDay = (query?: PhotoOfTheDayQuery): cancellableRequestGetClass | Promise<unknown> => {
    try {
      // validate query parameters are each YYYY-MM-DD format
      // validation doesn't check for other invalid params
      if (query && !this.validatePOTDParams(query)) {
        return Promise.reject('Invalid query parameters');
      }

      const url = this._getURL('/planetary/apod', { api_key: API_KEY, ...query });
      const photosRequest = new cancellableRequestGetClass(url);

      photosRequest.catch((err) => {
        console.error('Error fetching Photo of the Day:', err);
      });

      return photosRequest.then((response): PhotoOfTheDay[] | [] => {
        let photos: PhotoOfTheDay[] | [] = [];
        if (response) {
          if (Array.isArray(response)) {
            photos = response.map(this._transformPOTDResponse);
          } else {
            photos = [this._transformPOTDResponse(response as PhotoOfTheDayResponse)];
          }
        }
        return photos;
      });
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  };
}
