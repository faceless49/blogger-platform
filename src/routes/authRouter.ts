import { Request, Response, Router } from 'express';
import { inputValidationMiddleware } from '../middlewares';
import { body, validationResult } from 'express-validator';
import { usersService } from '../domain/users-service';
import { jwtService } from '../application/jwtService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { usersQueryRepository } from '../repositories/usersQueryRepository';

export const authRouter = Router({});
const loginValidation = body('loginOrEmail').trim().notEmpty().isString();
const passValidation = body('password').trim().notEmpty().isString();
const regLoginValidation = body('login')
  .trim()
  .notEmpty()
  .isString()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/);
const regEmailValidation = body('email')
  .trim()
  .notEmpty()
  .isString()
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
const regPassValidation = body('password')
  .trim()
  .notEmpty()
  .isString()
  .isLength({ min: 6, max: 20 });

authRouter
  .post(
    '/login',
    loginValidation,
    passValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { loginOrEmail, password } = req.body;
      const user = await usersService.checkCredentials(loginOrEmail, password);
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
  })

  .post('/registration-confirmation', async (req: Request, res: Response) => {
    const result = await usersService.confirmEmail(req.body.code);
    if (result) {
      res.status(201).send();
    } else {
      res.sendStatus(400);
    }
  })
  .post(
    '/registration',
    regEmailValidation,
    regEmailValidation,
    regPassValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { login, password, email } = req.body;

      const isLoginExist = await usersQueryRepository.findByLoginOrEmail(login);
      const isEmailExist = await usersQueryRepository.findByLoginOrEmail(email);
      const error = validationResult(req).formatWith(({ param, msg }) => {
        return {
          message: msg,
          field: param,
        };
      });
      const errors = {
        errorsMessages: error.array({ onlyFirstError: true }),
      };
      if (isEmailExist || isLoginExist) {
        return res.send(400);
      }
      const user = await usersService.createUser(login, password, email);
      if (user) {
        res.sendStatus(204);
      } else {
        res.sendStatus(400).send(errors);
      }
    },
  )
  .post('/registration-email-resending', async (req: Request, res: Response) => {
    const result = await usersService.confirmEmail(req.body.code);
    if (result) {
      res.status(201).send();
    } else {
      res.sendStatus(400);
    }
  });
