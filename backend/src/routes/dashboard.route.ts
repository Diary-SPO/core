import express, { type Request, type Response } from 'express'

import axiosInstance from '../axiosWrapper'
import { checkCookie, checkId } from '../middleware'

const router = express.Router()

router.post('/:id', [checkId, checkCookie], async (req: Request, res: Response) => {
  try {
    const secret = req.headers.secret
    const { id } = req.params

    // TODO: Указать тип
    const response = await axiosInstance.get(`/students/${id}/dashboard`, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: secret
      }
    })

    const data = response.data
    res.status(200).json(data)
  } catch (e) {
    console.error('/students/id/dashboard', e)
    res.status(500).json(`Internal server error: ${e as string}`)
  }
})

export default router
