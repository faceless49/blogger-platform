import { Request, Response, Router } from 'express';
import { commentsQueryRepository } from '../repositories/commentsQueryRepository';
import { inputValidationMiddleware } from '../middlewares';
import { authMiddleware } from '../middlewares/authMiddleware';
import { commentsService } from '../domain/comments-service';
import { body } from 'express-validator';

export const commentsRouter = Router({});

commentsRouter

  .get('/comments/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const comment = await commentsQueryRepository.getCommentById(id);
    comment ? res.send(comment) : res.send(404);
  })

  .delete(
    '/comments/:id',
    authMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const userId = req.user.id;
      const comment = await commentsQueryRepository.getCommentById(id);
      if (comment && comment.userId === userId) {
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
    '/comments/:id',
    authMiddleware,
    body('content').trim().notEmpty().isString().isLength({ min: 20, max: 300 }),
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;
      const comment = await commentsQueryRepository.getCommentById(id);
      if (comment && comment.userId === userId) {
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
