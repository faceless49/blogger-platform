import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const errors = validationResult(req).formatWith(({msg, param}) => {
    return {
      message: msg,
      field: param
    }
  });
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  next()
}