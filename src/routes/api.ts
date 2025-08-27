import express from 'express';
import NasaAPIHandler from '../utils/nasaAPIHandler';

const router = express.Router();

const nasaAPIHandler = new NasaAPIHandler();

router.get('/photo-of-the-day', (req, res) => {
  nasaAPIHandler
    .getPhotoOfTheDay(req.query)
    .then((photos) => {
      res.status(200).send({ photos });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

router.get('/mars-photos', (req, res) => {
  nasaAPIHandler
    .getMarsPhotos(req.query)
    .then((photos) => {
      res.status(200).send({ photos });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

export default router;
