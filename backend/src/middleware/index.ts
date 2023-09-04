import { type NextFunction, type Request, type Response } from 'express'

export const preventCrossSiteScripting = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
}

export const checkId = (req: Request, res: Response, next: NextFunction): any => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json('Something is bad #2')
  }

  next()
}

export const checkCookie = (req: Request, res: Response, next: NextFunction): any => {
  const secret = req.headers.secret

  if (!secret || typeof secret !== 'string') {
    return res.status(400).json('Something is bad #1')
  }

  next()
}
