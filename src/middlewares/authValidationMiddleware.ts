import { Response, Request, NextFunction } from 'express';

const base64auth = 'Basic YWRtaW46cXdlcnR5'

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization !== base64auth) {
    return res.sendStatus(401)
  }
  next()
}