import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/authMiddleware';

export const commentsRouter = Router({});
const loginValidation = body('login').trim().notEmpty().isString();
const passValidation = body('password').trim().notEmpty().isString();

commentsRouter.get(
  '/comments/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
  },
);
