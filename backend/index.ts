import express from 'express';
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
  const currentDate = new Date();
  const startDate = currentDate.toISOString().substring(0, 10);
  const endDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
  
  try {
    const response = await fetch(`https://poo.tomedu.ru/services/students/302/lessons/${startDate}/${endDate}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: req.headers.secret as string
      }
    });
    
    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error(e)
  }
});


app.post('/login', async (req, res) => {
  try {
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
  } catch (e) {
    console.log(e)
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
