import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { blogRepository } from '../repositories/blogRepository';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';
import { BlogType } from '../types';

const youtubeRegex = new RegExp('/^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/')
export const blogsRouter = Router({})

const nameValidation = body('name').trim().notEmpty().isString().isLength({
  max: 15
})
const urlYoutubeValidation = body('youtubeUrl').trim().notEmpty().isString().isLength({
  max: 100
}).matches(youtubeRegex)


blogsRouter.get('/', (req: Request, res: Response) => {
  res.send(blogRepository.getBlogs())
})

  .post('/', nameValidation, urlYoutubeValidation, inputValidationMiddleware,
    (req: Request, res: Response) => {

      const {name, youtubeUrl} = req.body;

      res.send(blogRepository.createBlog(name, youtubeUrl))
    })


  .get('/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const blog = blogRepository.getBlogById(+id)
    blog ? res.send(blog) : res.sendStatus(404)
    return;
  })

  .put('/:id',
    nameValidation, urlYoutubeValidation, inputValidationMiddleware,
    (req: Request, res: Response) => {
      const {
        id
      } = req.params;
      const {name, youtubeUrl} = req.body;
      const payload: BlogType = {id: +id, name, youtubeUrl}

      const isUpdated = blogRepository.updateVideoById(payload)
      isUpdated ? res.sendStatus(204) : res.send(404)
    })


  .delete('/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const isDeleted = blogRepository.deleteVideoById(+id);

    isDeleted ? res.sendStatus(204) : res.send(404)
  })