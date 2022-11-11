import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../application/jwtService';
import { usersQueryRepository } from '../repositories/usersQueryRepository';
import { AUTH_SCHEME_BEARER } from '../consts';

const base64auth = 'Basic YWRtaW46cXdlcnR5';

export const authValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.headers.authorization !== base64auth) {
    return res.sendStatus(401);
  }
  next();
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.send(401);
    return;
  }
  const token = req.headers.authorization.replace(`${AUTH_SCHEME_BEARER}`, '');

  const userId = await jwtService.getUserIdByToken(token);
  if (userId) {
    req.user = await usersQueryRepository.getUserById(userId);
    next();
    return;
  }
  res.send(401);
};
