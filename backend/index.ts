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
  max: 50,
  statusCode: 200,
  message: 'ОК',
});

const hosts = ['localhost', 'https://prod-app51743817'];

app.use(limiter);

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 204,
}));

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': 'https://prod-app51743817-951dbcc22b92.pages-ac.vk-apps.com',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  })
  const resHost = req.get('Origin') || req.get('Host') || null;
  console.log(resHost);
  let   isCORS = true;
  if(resHost != null)
  for(let i = 0; i < hosts.length; i++) {
    if (resHost.indexOf(hosts[i]) >= 0) {
      isCORS = false;
      break;
    }
  }
  if (!isCORS) next();
  else         res.status(200).send('CORS');
});

app.use('/', helloRoute);
app.use('/lessons', lessonsRoute);
app.use('/login', loginRoute);
app.use('/dashboard', dashboard);
app.use('/performance.current', performanceCurrent);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

