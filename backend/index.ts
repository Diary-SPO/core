import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

const apiUrl = process.env.SERVER_URL;
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/lessons', async (req: Request, res: Response) => {
  
  // Ваш код для обработки маршрута /lessons
  const currentDate = new Date();
  const startDate = currentDate.toISOString().substring(0, 10);
  const endDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10);
  
  try {
    const response = await fetch(`${apiUrl}/students/302/lessons/${startDate}/${endDate}`, {
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

app.post('/login', async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${apiUrl}/security/login`, {
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
    
    const setCookieHeader = response.headers.get('Set-Cookie');
    
    console.log(setCookieHeader);
    
    res.json({ data, cookie: setCookieHeader });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
