import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { blogRepository } from '../repositories/blogRepository';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { PostType } from '../types';
import { postsRepository } from '../repositories/postsRepository';
import { authValidationMiddleware } from '../middlewares/authValidationMiddleware';

export const postsRouter = Router({})
const titleValidation = body('title').trim().notEmpty().isString().isLength({max: 30});
const shortDescriptionValidation = body('shortDescription').trim().notEmpty().isString().isLength({max: 100});
const contentValidation = body('content').trim().notEmpty().isString().isLength({max: 1000});
const blogIdValidation = body('blogId').trim().notEmpty().isString().custom((value, {req}) => {
  const blogger = blogRepository.getBlogById(req.body.blogId);
  if (!blogger) {
    throw new Error('Blogger not found');
  }
  return true;
})


postsRouter.get('/', (req: Request, res: Response) => {
  res.send(postsRepository.getPosts())
})

  .post('/',
    authValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req: Request<Omit<PostType, 'id' | 'blogName'>>, res: Response) => {

      const {title, shortDescription, content, blogId} = req.body;
      const blogger = blogRepository.getBlogById(blogId);
      if (blogger) {
        const payload = {
          title, shortDescription, content, blogName: blogger.name, blogId
        }
        return res.status(201).send(postsRepository.createPost(payload))
      }
      return res.send(400)
    })


  .get('/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const post = postsRepository.getPostById(id)
    post ? res.send(post) : res.sendStatus(404)
    return;
  })

  .put('/:id',
    authValidationMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
      const {
        id
      } = req.params;
      const {title, shortDescription, content, blogId} = req.body;

      const payload = {id, title, shortDescription, content, blogId}

      const isUpdated = postsRepository.updatePostById(payload)
      isUpdated ? res.sendStatus(204) : res.send(404)
    })


  .delete('/:id', authValidationMiddleware, (req: Request, res: Response) => {
    const {id} = req.params

    const isDeleted = postsRepository.deletePostById(id);

    isDeleted ? res.sendStatus(204) : res.send(404)
  })