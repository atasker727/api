import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import apiRoutes from './routes/api';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.API_PORT || 3000;

// const API_PREFIX = process.env.API_PREFIX || '/api';

// const apiURL = (url: string) => `${API_PREFIX}/${url}`;

app.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log('middle');
  next();
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
