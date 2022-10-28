import { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import { blogsService } from '../domain/blogs-service';
import { BlogType } from '../types';
import { authValidationMiddleware, inputValidationMiddleware } from '../middlewares';
import { getPaginationData } from '../helpers';
import {
  contentValidation,
  shortDescriptionValidation,
  titleValidation,
} from './postsRouter';

const youtubeRegex =
  '^https:\\/\\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';
export const blogsRouter = Router({});

const nameValidation = body('name').trim().notEmpty().isString().isLength({
  max: 15,
});
const urlYoutubeValidation = body('youtubeUrl')
  .trim()
  .notEmpty()
  .isString()
  .isLength({
    max: 100,
  })
  .matches(youtubeRegex);
const blogIdValidation = body('blogId')
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

const blogParamsValidation = param('id')
  .trim()
  .notEmpty()
  .isString()
  .custom(async (value, { req }) => {
    const blogger = await blogsService.getBlogById(req?.params?.id);
    if (!blogger) {
      return 404;
    }
    return true;
  });

blogsRouter
  .get('/', async (req: Request, res: Response) => {
    const reqParams = getPaginationData(req.query);
    const result = await blogsService.getBlogs(reqParams);
    res.send(result);
  })

  .post(
    '/',
    authValidationMiddleware,
    nameValidation,
    urlYoutubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { name, youtubeUrl } = req.body;
      const response = await blogsService.createBlog(name, youtubeUrl);
      res.status(201).send(response);
    },
  )

  .post(
    '/:id/posts',
    authValidationMiddleware,
    blogParamsValidation,
    contentValidation,
    titleValidation,
    shortDescriptionValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { title, shortDescription, content } = req.body;
      const blog = await blogsService.getBlogById(id);
      if (!blog) {
        return res.send(404);
      }
      const response = await blogsService.createPostByBlogId(
        blog!,
        title,
        shortDescription,
        content,
      );
      res.status(201).send(response);
    },
  )

  .get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const blog = await blogsService.getBlogById(id);
    blog ? res.send(blog) : res.sendStatus(404);
  })

  .get('/:id/posts', blogParamsValidation, async (req: Request, res: Response) => {
    const { id } = req.params;
    const reqParams = getPaginationData(req.query);
    const blog = await blogsService.getBlogById(id);
    if (!blog) {
      res.send(404);
      return;
    }
    const postsOutput = await blogsService.getPostsByBlogId(reqParams, blog!.id);
    postsOutput ? res.send(postsOutput) : res.sendStatus(404);
  })

  .put(
    '/:id',
    authValidationMiddleware,
    nameValidation,
    urlYoutubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { name, youtubeUrl } = req.body;
      const payload: Omit<BlogType, 'createdAt'> = { id, name, youtubeUrl };

      const isUpdated = await blogsService.updateVideoById(payload);
      isUpdated ? res.sendStatus(204) : res.send(404);
    },
  )

  .delete(
    '/:id',
    authValidationMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const isDeleted = await blogsService.deleteVideoById(id);

      isDeleted ? res.send(204) : res.send(404);
    },
  );
