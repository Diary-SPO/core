import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';

import { preventCrossSiteScripting } from './src/middleware';

import {
  dashboard, helloRoute, lessonsRoute, loginRoute, performanceCurrent
} from './src/routes';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(preventCrossSiteScripting);
app.use(helmet());

const FIFTEEN_MINS_IN_MS = 900000;

app.use(express.json());

const limiter = rateLimit({
  windowMs: FIFTEEN_MINS_IN_MS,
  max: 30,
  statusCode: 200,
  message: 'ОК',
});

app.use(limiter);

app.use(cors({
  origin: 'https://stage-app51740302-19b73c109043.pages.vk-apps.com'
}));

app.use('/', helloRoute);
app.use('/lessons', lessonsRoute);
app.use('/login', loginRoute);
app.use('/dashboard', dashboard);
app.use('/performance.current', performanceCurrent);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

