import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { blogRepository } from '../repositories/blogRepository';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { BlogType } from '../types';
import { authValidationMiddleware } from '../middlewares/authValidationMiddleware';

const youtubeRegex = '^https:\\/\\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'
export const blogsRouter = Router({})

const nameValidation = body('name').trim().notEmpty().isString().isLength({
  max: 15
})
const urlYoutubeValidation = body('youtubeUrl').trim().notEmpty().isString().isLength({
  max: 100
}).matches(youtubeRegex);


blogsRouter.get('/', async (req: Request, res: Response) => {
  const result = await blogRepository.getBlogs()
  res.send(result)
})

  .post('/', authValidationMiddleware,
    nameValidation,
    urlYoutubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

      const {name, youtubeUrl} = req.body;
      const response = await blogRepository.createBlog(name, youtubeUrl)
      res.status(201).send(response)
    })


  .get('/:id', async (req: Request, res: Response) => {
    const {id} = req.params
    const blog = await blogRepository.getBlogById(id)
    blog ? res.send(blog) : res.sendStatus(404)
  })

  .put('/:id',
    authValidationMiddleware,
    nameValidation,
    urlYoutubeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const {
        id
      } = req.params;
      const {name, youtubeUrl} = req.body;
      const payload: Omit<BlogType, "createdAt"> = {id, name, youtubeUrl}

      const isUpdated = await blogRepository.updateVideoById(payload)
      isUpdated ? res.sendStatus(204) : res.send(404)
    })


  .delete('/:id', authValidationMiddleware, inputValidationMiddleware,
    async (req: Request, res: Response) => {
      const {id} = req.params
      const isDeleted = await blogRepository.deleteVideoById(id);

      isDeleted ? res.send(204) : res.send(404)
    })