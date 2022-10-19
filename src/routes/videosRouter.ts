import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import { videosRepository } from '../repositories/videosRepository';
import { Resolutions } from '../types';
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware';

export const videosRouter = Router({})


const titleValidation = body('title').trim().notEmpty().isString().isLength({
  min: 0,
  max: 40
})

const authorValidation = body('author').trim().notEmpty().isLength({
  min: 0,
  max: 20,
});

const availableResolutionsValidation = body('availableResolutions').isArray().optional({nullable: true}).custom((value) => {
  value.forEach((el: Resolutions) => {
    if (el == Resolutions.P144 || el == 'P240' || el == 'P360' || el == 'P480' || el == 'P720' || el == 'P1080' || el == 'P1440' || el == 'P2160') {
      return true
    }
    throw new Error('The el is required')
  });
  return true;
});
const minAgeValidation = body('minAgeRestriction').trim().notEmpty().isFloat({
  min: 1,
  max: 18
}).optional({nullable: true});


videosRouter.get('/', (req: Request, res: Response) => {
  return res.send(videosRepository.getVideos())
})

  .post('/',
    titleValidation,
    authorValidation,
    availableResolutionsValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
      const error = validationResult(req).formatWith(({param, msg,}) => {
        return {
          message: msg,
          field: param
        }
      })
      const hasError = !error.isEmpty();
      const {title, author, availableResolutions} = req.body
      if (!hasError) {
        const newVideo = videosRepository.createVideo(title, author, availableResolutions);
        res.status(201).send(newVideo);
        return;
      }

      const errors = {
        errorsMessages: error.array({onlyFirstError: true})
      }

      res.status(400).send(errors)
    })


  .get('/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const video = videosRepository.getVideoById(+id)
    video ? res.send(video) : res.sendStatus(404)
    return;
  })

  .put('/:id',
    titleValidation,
    authorValidation,
    minAgeValidation,
    body('availableResolutions.*').trim().notEmpty().isString().optional({nullable: true}),
    body('canBeDownloaded').isBoolean(),
    body('publicationDate').isString(),
    inputValidationMiddleware,
    (req: Request, res: Response) => {
      const {
        id
      } = req.params;
      const {
        author,
        availableResolutions,
        minAgeRestriction = null,
        title,
        canBeDownloaded = false,
        publicationDate
      } = req.body

      const payload = {
        id: +id,
        title,
        author,
        availableResolutions,
        minAgeRestriction: +minAgeRestriction,
        publicationDate,
        canBeDownloaded
      }
      const isUpdated = videosRepository.updateVideoById(payload);

      isUpdated ? res.send(204) : res.send(404);
    }
  )


  .delete('/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const isDeleted = videosRepository.deleteVideoById(+id)
    isDeleted ? res.sendStatus(204) : res.send(404)
  })