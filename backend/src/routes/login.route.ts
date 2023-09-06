import express, { type Request, type Response } from 'express'
import { AxiosError, type AxiosResponse } from 'axios'
import axiosInstance from '../axiosWrapper'
import { type AuthData } from '../../../shared'

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  const { login, password } = req.body
  console.log(login)
  if (!login || !password || typeof login !== 'string' || typeof password !== 'string') {
    return res.status(400).json('Invalid login or password')
  }

  try {
    const response: AxiosResponse<AuthData> = await axiosInstance.post('/security/login', {
      login,
      password,
      isRemember: true
    }, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // origin: origin
      }
    })

    const data = response.data

    const setCookieHeader = response.headers['set-cookie']
    const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader

    return res.status(response.status).json({ data, cookie: cookieString })
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
      return res.status(500).json(`Internal server error: ${error as string}`)
    }
  }
})

export default router
