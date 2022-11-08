import { Request, Response, Router } from 'express';
import { inputValidationMiddleware } from '../middlewares';
import { body } from 'express-validator';
import { usersService } from '../domain/users-service';

export const authRouter = Router({});
const loginValidation = body('login').trim().notEmpty().isString();
const passValidation = body('password').trim().notEmpty().isString();

authRouter.post(
  '/',
  loginValidation,
  passValidation,
  inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const { login, password } = req.body;
    const checkResult = await usersService.checkCredentials(login, password);
  },
);
