import { Request, Response, Router } from 'express';
import { authValidationMiddleware, inputValidationMiddleware } from '../middlewares';
import { UserType } from '../types/types';
import { getPaginationData } from '../helpers';
import { usersQueryRepository } from '../repositories/usersQueryRepository';
import { body } from 'express-validator';
import { usersService } from '../domain/users-service';

export const usersRouter = Router({});
export const loginValidation = body('login')
  .trim()
  .notEmpty()
  .isString()
  .isLength({ min: 3, max: 10 });
export const passValidation = body('password')
  .trim()
  .notEmpty()
  .isString()
  .isLength({ min: 6, max: 20 });
const emailRegex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
const emailValidation = body('email').trim().notEmpty().isString().matches(emailRegex);

usersRouter
  .get(
    '/',
    authValidationMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const reqParams = getPaginationData(req.query);
      const users = await usersQueryRepository.getUsers(reqParams);
      res.send(users);
    },
  )

  .post(
    '/',
    authValidationMiddleware,
    loginValidation,
    passValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req: Request<UserType>, res: Response) => {
      const { login, password, email } = req.body;
      const user = await usersService.createUser(login, password, email);
      res.status(201).send(user);
    },
  )
  .delete('/:id', authValidationMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    const isDeleted = await usersService.deleteUserById(id);

    isDeleted ? res.sendStatus(204) : res.send(404);
  });
