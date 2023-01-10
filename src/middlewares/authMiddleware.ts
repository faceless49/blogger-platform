import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../application/jwtService';
import { usersQueryRepository } from '../repositories/usersQueryRepository';
import { AUTH_SCHEME_BEARER } from '../consts';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserDBType } from '../types/types';

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

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const decoded: JwtPayload | string = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET || '1234',
    );
    debugger;
    console.log(decoded);
    // @ts-ignore
    const user: UserDBType | null = await usersQueryRepository.getUserById(decoded.id);
    if (!user) {
      res.status(404).send('user from jwt data not found\n');
      return;
    } else if (user.revokedTokens?.includes(refreshToken)) {
      return res.sendStatus(401);
    }
    req.user = user;
    res.locals.userData = user;
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  }
  next();
  return;
};
