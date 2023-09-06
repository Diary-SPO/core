import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';

import { preventCrossSiteScripting } from './src/middleware';

import {
  dashboard, helloRoute, lessonsRoute, loginRoute, performanceCurrent
} from './src/routes';
import corsConfig from "./src/corsConfig";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(preventCrossSiteScripting);
app.use(helmet());

const FIFTEEN_MINS_IN_MS = 900000;

app.use(express.json());

const limiter = rateLimit({
  windowMs: FIFTEEN_MINS_IN_MS,
  max: 50,
  statusCode: 200,
  message: 'ОК',
});

app.use(limiter);
app.use(corsConfig);

// app.use(cors({
//   origin: 'https://localhost:5173',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   optionsSuccessStatus: 200,
// }));

app.use('/', helloRoute);
app.use('/lessons', lessonsRoute);
app.use('/login', loginRoute);
app.use('/dashboard', dashboard);
app.use('/performance.current', performanceCurrent);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

