import { Response } from 'express';
import type { PhotoOfTheDayResponse, PhotoOfTheDay, MarsPhoto, MarsPhotoResponse } from '../common/types/photoTypes';
import { cancellableRequestGet, getFullURLWithParams } from '../common/utils/requestsCore';

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
    return getFullURLWithParams(ROOT_URL + endpoint, { api_key: API_KEY, ...options });
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

  getPhotoOfTheDay = (query?: PhotoOfTheDayQuery): Promise<unknown> => {
    // getPhotoOfTheDay = (query?: PhotoOfTheDayQuery): cancellableRequestClassType | Promise<unknown> => {
    try {
      // validate query parameters are each YYYY-MM-DD format
      // validation doesn't check for other invalid params
      if (query && !this.validatePOTDParams(query)) {
        return Promise.reject('Invalid query parameters');
      }

      const url = this._getURL('/planetary/apod', query);

      const photosRequest = cancellableRequestGet(url);

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

  _transformMarsPhotoResponse = (photo: MarsPhotoResponse): MarsPhoto => ({
    title: `${photo.rover.name} - ${photo.camera.name} | ${photo.earth_date}`,
    date: photo.earth_date,
    id: photo.id,
    sol: photo.sol,
    imageURL: photo.img_src,
  });

  getMarsPhotos() {
    const query = {
      sol: 1000,
      camera: 'fhaz',
    };
    const url = this._getURL('/mars-photos/api/v1/rovers/curiosity/photos', query);

    const photosRequest = cancellableRequestGet(url);

    photosRequest.catch((err) => {
      console.error('Error fetching Photo of the Day:', err);
    });

    return photosRequest.then((response): MarsPhoto[] | [] => {
      let photos: MarsPhoto[] | [] = [];
      const marsResponse = response as { photos: MarsPhotoResponse[] | [] };
      if (marsResponse?.photos) {
        photos = marsResponse.photos.map(this._transformMarsPhotoResponse);
      }
      return photos;
    });
  }
}
