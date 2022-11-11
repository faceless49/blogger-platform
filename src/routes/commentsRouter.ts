import { Request, Response, Router } from 'express';
import { commentsQueryRepository } from '../repositories/commentsQueryRepository';
import { inputValidationMiddleware } from '../middlewares';
import { authMiddleware } from '../middlewares/authMiddleware';
import { commentsService } from '../domain/comments-service';

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
      }

      if (!comment) {
        res.send(404);
      }

      res.send(403);
    },
  );
