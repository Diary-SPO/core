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
  const response = await fetch('https://poo.tomedu.ru/services/students/302/lessons/2023-08-28/2023-09-10', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Cookie: req.headers.secret as string
    }
  });
  const data = await response.json();

  res.json(data);
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
  console.log(cookie)
  // @ts-ignore
  res.json({data, cookie});
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
