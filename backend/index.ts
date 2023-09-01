import express from 'express';
import * as https from 'https';
import cors from 'cors';

import 'dotenv/config'

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}))

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.get('/lessons', async (req, res) => {
  https.get('https://poo.tomedu.ru/services/students/302/lessons/2023-08-28/2023-09-10', {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Cookie: req.headers.secret
    },
  }, externalRes => {
    let data: Buffer[] = [];
    const headerDate = externalRes.headers && externalRes.headers.date ? externalRes.headers.date : 'no response date';
    console.log('Status Code:', externalRes.statusCode);
    console.log('Date in Response header:', headerDate);
    
    externalRes.on('data', chunk => {
      data.push(chunk);
    });
    
    externalRes.on('end', () => {
      console.log('Response ended: ');
      const responseData = JSON.parse(Buffer.concat(data).toString());
      console.log(responseData);
      res.json(responseData);
    });
  }).on('error', err => {
    console.log('Error: ', err.message);
    res.status(500).send('Error occurred');
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
