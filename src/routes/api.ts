import express, { Request, Response } from 'express';
import NasaAPIHandler from '../utils/nasaAPIHandler';

const router = express.Router();

const nasaAPIHandler = new NasaAPIHandler();

router.get('/', (_req: Request, res: Response) => {
  const { responsePromise } = nasaAPIHandler.getPhotoOfTheDay();

  responsePromise.then((data) => {
    res.status(200).send({ data });
  });
});

// look at these headers for rate limiting returned from the api
//  X-RateLimit-Limit X-RateLimit-Remaining

// write middleware to log time & rate limit headers
// router.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(`Request URL: ${req.url}`);
//   console.log(`Request Method: ${req.method}`);
//   console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
//   console.log(`Request Time: ${new Date().toISOString()}`);
//   console.log(
//     `Rate Limit Headers: X-RateLimit-Limit=${res.getHeader('X-RateLimit-Limit')}, X-RateLimit-Remaining=${res.getHeader('X-RateLimit-Remaining')}`,
//   );
//   next();
// });

router.get('/photo-of-the-day', (_req, res) => {
  const { responsePromise } = nasaAPIHandler.getPhotoOfTheDay();

  responsePromise
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      console.log('expected');
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

export default router;
