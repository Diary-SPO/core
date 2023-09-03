import express, { type Request, type Response } from 'express'

import axiosInstance from '../axiosWrapper'

const router = express.Router()

router.get('/:id/:startDate/:endDate', async (req: Request, res: Response) => {
  try {
    const secret = req.headers.secret

    if (!secret || typeof secret !== 'string') {
      return res.status(500).json('Something is wrong')
    }

    const { startDate, endDate, id } = req.params
    let formattedStartDate, formattedEndDate

    if (!id) {
      return res.status(500).json('Something is wrong')
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

    const response = await axiosInstance.get(`/students/${id}/lessons/${formattedStartDate}/${formattedEndDate}`, {
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

export default router
