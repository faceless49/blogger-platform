import { Request, Response, Router } from 'express';
import { inputValidationMiddleware } from '../middlewares';
import { body } from 'express-validator';
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
        res.send(response);
      }
      res.sendStatus(401);
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

  .post(
    '/registration-confirmation',
    body('code').trim().notEmpty().isString(),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const result = await usersService.confirmEmail(req.body.code);
      if (result) {
        res.sendStatus(204);
      } else {
        res.status(400).json({
          errorsMessages: [{ message: 'wrong code', field: 'code' }],
        });
      }
    },
  )
  .post(
    '/registration',
    regLoginValidation,
    regEmailValidation,
    regPassValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { login, password, email } = req.body;
      const isLoginExist = await usersQueryRepository.findByLoginOrEmail(login);
      const isEmailExist = await usersQueryRepository.findByLoginOrEmail(email);
      const errors = [];
      if (isEmailExist || isLoginExist) {
        errors.push({
          message: isEmailExist ? 'email already exist' : 'login already exist',
          field: isEmailExist ? 'email' : 'login',
        });
        return res.status(400).send({ errorsMessages: errors });
      }
      const user = await usersService.createUser(login, password, email);
      if (user) {
        return res.sendStatus(204);
      } else {
        res.status(400).send({
          errorsMessages: [{ message: 'wrong code', field: 'code' }],
        });
      }
    },
  )
  .post(
    '/registration-email-resending',
    regEmailValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const result = await usersService.resendEmail(req.body.email);
      if (result) {
        res.status(204).send();
      } else {
        res.status(400).send({
          errorsMessages: [{ message: 'email is confirmed', field: 'email' }],
        });
      }
    },
  );
