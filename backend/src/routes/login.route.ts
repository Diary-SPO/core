import express, { type Request, type Response } from 'express'
import axios, { AxiosError } from 'axios'

const apiUrl = process.env.SERVER_URL
const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
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
    
    console.log(`CODE: ${response.status}`, response.data)
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

export default router
