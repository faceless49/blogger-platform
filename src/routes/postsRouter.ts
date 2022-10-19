import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { blogRepository } from '../repositories/blogRepository';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { BlogType, PostType } from '../types';
import { postsRepository } from '../repositories/postsRepository';

export const postsRouter = Router({})

const titleValidation = body('title').trim().notEmpty().isString().isLength({max: 30});
const shortDescription = body('shortDescription').trim().notEmpty().isString().isLength({max: 100});
const content = body('content').trim().notEmpty().isString().isLength({max: 1000});
const blogId = body('blogId').trim().notEmpty().isString()
const blogName = body('blogName').trim().notEmpty().isString()


postsRouter.get('/', (req: Request, res: Response) => {
  res.send(postsRepository.getPosts())
})

  .post('/', inputValidationMiddleware,
    (req: Request<Omit<PostType, 'id' | 'blogName'>>, res: Response) => {

      const {title, shortDescription, content, blogId} = req.body;

      res.send(postsRepository.createPost({title, shortDescription, content, blogId}))
    })


  .get('/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const post = postsRepository.getPostById(id)
    post ? res.send(post) : res.sendStatus(404)
    return;
  })

  .put('/:id',
    inputValidationMiddleware,
    (req: Request, res: Response) => {
      const {
        id
      } = req.params;
      const {title, shortDescription, content, blogId} = req.body;

      const payload = {title, shortDescription, content, blogId}

      // const isUpdated = postsRepository.updatePostById(payload)
      // isUpdated ? res.sendStatus(204) : res.send(404)
    })


  .delete('/:id', (req: Request, res: Response) => {
    const {id} = req.params

    const isDeleted = postsRepository.deletePostById(id);

    isDeleted ? res.sendStatus(204) : res.send(404)
  })