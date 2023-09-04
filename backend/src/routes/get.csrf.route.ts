import express from 'express'
import csrf from 'csurf'

const router = express.Router()
const csrfProtection = csrf({ cookie: true })

router.get('/getCsrfToken', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken()

  res.json({ csrfToken })
})

export default router
