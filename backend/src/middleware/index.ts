import { type NextFunction, type Request, type Response } from 'express'

export const preventCrossSiteScripting = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
}

export const checkData = (req: Request, res: Response, next: NextFunction): Response => {
  const secret = req.headers.secret

  if (!secret || typeof secret !== 'string') {
    return res.status(400).json('Something is bad #1')
  }

  const { id } = req.params

  if (!id) {
    return res.status(400).json('Something is bad #2')
  }

  next()
  return res.status(200).json('OK')
}
