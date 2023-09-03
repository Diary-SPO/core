import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'

import {
  dashboard, helloRoute, lessonsRoute, loginRoute, performanceCurrent
} from './src/routes'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors({ origin: '*' }))

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80,
  message: 'Превышено ограничение запросов в минуту'
})

app.use(limiter)

app.use('/', helloRoute)
app.use('/lessons', lessonsRoute)
app.use('/login', loginRoute)
app.use('/dashboard', dashboard)
app.use('/performance.current', performanceCurrent)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
