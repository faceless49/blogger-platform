import { Request, Response, Router } from 'express';
import { inputValidationMiddleware } from '../middlewares';
import { body } from 'express-validator';
import { usersService } from '../domain/users-service';
import { jwtService } from '../application/jwtService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { usersQueryRepository } from '../repositories/usersQueryRepository';

export const authRouter = Router({});
const loginValidation = body('login').trim().notEmpty().isString();
const passValidation = body('password').trim().notEmpty().isString();

authRouter
  .post(
    '/login',
    loginValidation,
    passValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { login, password } = req.body;
      const user = await usersService.checkCredentials(login, password);
      if (user) {
        const token = await jwtService.createJWT(user);
        const response = {
          accessToken: token,
        };
        res.status(200).send(response);
        return;
      }
      res.send(401);
      return;
    },
  )
  .get('/me', authMiddleware, async (req: Request, res: Response) => {
    const currentUser = usersQueryRepository.getUserById(req.user.id);
    if (!currentUser) {
      res.send(401);
      return;
    }
    res.send(200);
    return;
  });
