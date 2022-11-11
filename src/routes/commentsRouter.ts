import { Request, Response, Router } from 'express';
import { commentsQueryRepository } from '../repositories/commentsQueryRepository';
import { inputValidationMiddleware } from '../middlewares';
import { authMiddleware } from '../middlewares/authMiddleware';
import { commentsService } from '../domain/comments-service';
import { body } from 'express-validator';
import { usersQueryRepository } from '../repositories/usersQueryRepository';

export const commentsRouter = Router({});

commentsRouter

  .get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const comment = await commentsQueryRepository.getCommentById(id);
    comment ? res.send(comment) : res.send(404);
  })

  .delete(
    '/:id',
    authMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const currentUser = await usersQueryRepository.getUserById(req.user.id);
      const comment = await commentsQueryRepository.getCommentById(id);
      if (comment && currentUser && comment.userId === currentUser.id) {
        const isDeleted = await commentsService.deleteCommentById(id);
        isDeleted && res.send(204);
        return;
      }

      if (!comment) {
        res.send(404);
        return;
      }

      res.send(403);
      return;
    },
  )

  .put(
    '/:id',
    authMiddleware,
    body('content').trim().notEmpty().isString().isLength({ min: 20, max: 300 }),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { content } = req.body;
      const comment = await commentsQueryRepository.getCommentById(id);
      const currentUser = await usersQueryRepository.getUserById(req.user.id);

      if (comment && currentUser && comment.userId === currentUser.id) {
        const isUpdated = await commentsService.updateCommentById(id, content);
        isUpdated && res.send(204);
        return;
      }

      if (!comment) {
        res.send(404);
        return;
      }

      res.send(403);
      return;
    },
  );
