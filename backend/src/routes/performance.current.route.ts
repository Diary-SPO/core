import express, { type Request, type Response } from 'express'

import axiosInstance from '../axiosWrapper'
import { type AxiosResponse } from 'axios'
import { type PerformanceCurrent } from '../../../shared'

const router = express.Router()

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const secret = req.headers.secret

    if (!secret || typeof secret !== 'string') {
      return res.status(500).json('Something is wrong')
    }

    const { id } = req.params

    if (!id) {
      return res.status(500).json('Something is wrong')
    }

    const response: AxiosResponse<PerformanceCurrent> = await axiosInstance.get(`/reports/current/performance/${id}`, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: secret
      }
    })

    const data = response.data
    res.status(200).json(data)
  } catch (e) {
    console.error('/reports/current/performance/id', e)
    res.status(500).json(`Internal server error: ${e as string}`)
  }
})

export default router
