import { type Request, type Response, type NextFunction } from 'express'

export const preventCrossSiteScripting = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
}

export const checkId = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json('Something is bad #2')
  }

  next()
}

export const checkCookie = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const secret = req.headers.secret as string | undefined

  if (!secret || typeof secret !== 'string' || secret === '') {
    return res.status(400).json('Something is bad #1')
  }

  next()
}

const allowedHosts = ['localhost', 'https://prod-app51740302']

const isHostAllowed = (host: string): boolean => {
  return allowedHosts.some(allowedHost => host.includes(allowedHost))
}

export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.set({
    'Access-Control-Allow-Origin': 'https://stage-app51740302-f7d9a1dae661.pages.vk-apps.com',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  })

  const resHost = req.get('Origin') || req.get('Host') || null
  console.log(resHost)

  let isCORS = true

  if (resHost != null) {
    isCORS = !isHostAllowed(resHost)
  }

  if (isCORS) {
    res.status(200).send('OK')
  } else {
    next()
  }
}
