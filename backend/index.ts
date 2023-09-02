import express, { type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import 'dotenv/config'

const apiUrl = process.env.SERVER_URL
const app = express()
const port = process.env.PORT || 3000

app.use(cors({
  origin: '*'
}))

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80,
  message: 'Превышено ограничение запросов в минуту'
})

app.use(limiter)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello')
})

app.get('/lessons/:startDate/:endDate', async (req: Request, res: Response) => {
  const secret = req.headers.secret;
  
  if (!secret || typeof secret !== 'string') {
    res.json('Something is wrong').status(500);
    return;
  }
  
  const { startDate, endDate } = req.params;
  let formattedStartDate, formattedEndDate;
  
  if (startDate && endDate) {
    formattedStartDate = startDate.toString();
    formattedEndDate = endDate.toString();
  } else {
    const currentDate = new Date();
    formattedStartDate = currentDate.toISOString().substring(0, 10);
    
    const endDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    formattedEndDate = endDate.toISOString().substring(0, 10);
  }
  
  try {
    const response = await fetch(`${apiUrl}/students/302/lessons/${formattedStartDate}/${formattedEndDate}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: secret as string,
      },
    });
    
    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
});


app.post('/login', async (req: Request, res: Response) => {
  const login = req.headers.login
  const password = req.headers.password

  if (!login || !password || typeof login !== 'string' || typeof password !== 'string') {
    res.json('Something is wrong').status(500)
  }

  try {
    const response = await fetch(`${apiUrl}/security/login`, {
      method: 'post',
      body: JSON.stringify({
        login,
        password,
        isRemember: true
      }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })

    const data = await response.json()

    const setCookieHeader = response.headers.get('Set-Cookie')

    res.json({ data, cookie: setCookieHeader })
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
