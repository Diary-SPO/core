import express, { type Request, type Response } from 'express'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import axios, { Axios, AxiosError } from 'axios'
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

app.get('/lessons/:id/:startDate/:endDate', async (req: Request, res: Response) => {
  try {
    const secret = req.headers.secret

    if (!secret || typeof secret !== 'string') {
      res.json('Something is wrong').status(500)
      return
    }

    const { startDate, endDate, id } = req.params
    let formattedStartDate, formattedEndDate

    if (!id) {
      res.json('Something is wrong').status(500)
    }

    if (startDate && endDate) {
      formattedStartDate = startDate.toString()
      formattedEndDate = endDate.toString()

      const startTimestamp = new Date(startDate).getTime()
      const endTimestamp = new Date(endDate).getTime()
      const differenceInDays = (endTimestamp - startTimestamp) / (1000 * 3600 * 24)

      if (differenceInDays > 14) {
        const newEndDate = new Date(startTimestamp + 14 * 24 * 60 * 60 * 1000)
        formattedEndDate = newEndDate.toISOString().substring(0, 10)
      }
    } else {
      const currentDate = new Date()
      formattedStartDate = currentDate.toISOString().substring(0, 10)

      const endDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)
      formattedEndDate = endDate.toISOString().substring(0, 10)
    }

    const response = await axios.get(`${apiUrl}/students/${id}/lessons/${formattedStartDate}/${formattedEndDate}`, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: secret
      }
    })

    const data = response.data
    res.json(data)
  } catch (e) {
    console.error('/lessons/:id/:startDate/:endDate', e)
    res.status(500).json(`Internal server error: ${e}`)
  }
})

app.post('/login', async (req: Request, res: Response) => {
  const login = req.headers.login
  const password = req.headers.password

  if (!login || !password || typeof login !== 'string' || typeof password !== 'string') {
    return res.status(400).json('Invalid login or password')
  }

  try {
    const response = await axios.post(`${apiUrl}/security/login`, {
      login,
      password,
      isRemember: true
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })

    const data = response.data

    const setCookieHeader = response.headers['set-cookie']
    const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader

    return res.json({ data, cookie: cookieString }).status(response.status)
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError

      if (axiosError.response) {
        const { status, data } = axiosError.response
        return res.status(status).json(data)
      } else {
        console.error('/login', axiosError)
        return res.status(500).json(`Internal server error: ${axiosError.message}`)
      }
    } else {
      console.error('/login', error)
      return res.status(500).json(`Internal server error: ${error}`)
    }
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
