import express from 'express'
import cors from "cors";

const router = express.Router()

router.get('/', cors(), (req, res) => {
  res.send('Hello')
})

export default router
