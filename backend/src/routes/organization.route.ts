import express, { type Request, type Response } from 'express'

import axiosInstance from '../axiosWrapper'
import { checkCookie } from '../middleware'

const router = express.Router()

router.get('/', [checkCookie], async (req: Request, res: Response) => {
  try {
    const secret = req.headers.secret

    const response = await axiosInstance.get('/people/organization', {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: secret
      }
    })

    const data = response.data
    res.status(200).json(data)
  } catch (e) {
    console.error('/people/organization', e)
    res.status(500).json(`Internal server error: ${e as string}`)
  }
})

export default router
