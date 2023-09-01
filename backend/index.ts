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

app.post('/login', async (req, res) => {
  const response = await fetch('https://poo.tomedu.ru/services/security/login', {
    method: 'post',
    body: JSON.stringify({
      login: req.headers.login,
      password: req.headers.password,
      isRemember: true,
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
  const data = await response.json();
  const cookie = response.headers.getSetCookie().join()

  res.json({data, cookie});
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
