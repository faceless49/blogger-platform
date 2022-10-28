import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { authValidationMiddleware, inputValidationMiddleware } from '../middlewares';
import { PostType } from '../types';
import { postsService } from '../domain/posts-service';
import { blogsService } from '../domain/blogs-service';
import { getPaginationData } from '../helpers';
import { blogQueryRepository } from '../repositories/blogQueryRepository';

export const postsRouter = Router({});
export const titleValidation = body('title')
  .trim()
  .notEmpty()
  .isString()
  .isLength({ max: 30 });
export const shortDescriptionValidation = body('shortDescription')
  .trim()
  .notEmpty()
  .isString()
  .isLength({ max: 100 });
export const contentValidation = body('content')
  .trim()
  .notEmpty()
  .isString()
  .isLength({ max: 1000 });
export const blogIdValidation = body('blogId')
  .trim()
  .notEmpty()
  .isString()
  .custom(async (value, { req }) => {
    const blogger = await blogsService.getBlogById(req.body.blogId);
    if (!blogger) {
      throw new Error('Blogger not found');
    }
    return true;
  });

postsRouter
  .get('/', async (req: Request, res: Response) => {
    const reqParams = getPaginationData(req.query);
    const posts = await postsService.getPosts(reqParams);
    res.send(posts);
  })

  .post(
    '/',
    authValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request<Omit<PostType, 'id' | 'blogName'>>, res: Response) => {
      const { title, shortDescription, content, blogId } = req.body;
      const blogger = await blogQueryRepository.getBlogById(blogId);
      if (blogger) {
        const payload = {
          title,
          shortDescription,
          content,
          blogName: blogger.name,
          blogId,
        };
        const result = await postsService.createPost(payload);
        return res.status(201).send(result);
      }
      return res.send(400);
    },
  )

  .get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await postsService.getPostById(id);
    post ? res.send(post) : res.sendStatus(404);
    return;
  })

  .put(
    '/:id',
    authValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { title, shortDescription, content, blogId } = req.body;

      const payload = { id, title, shortDescription, content, blogId };

      const isUpdated = await postsService.updatePostById(payload);
      isUpdated ? res.sendStatus(204) : res.send(404);
    },
  )

  .delete('/:id', authValidationMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;

    const isDeleted = await postsService.deletePostById(id);

    isDeleted ? res.sendStatus(204) : res.send(404);
  });
