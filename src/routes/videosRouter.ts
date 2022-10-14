import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

export type VideoType = {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean,
  minAgeRestriction: null | number,
  createdAt: string,
  publicationDate: string,
  availableResolutions: string[]
}
export let videos: VideoType[] = []
export const videosRouter = Router({})

videosRouter.get('/', (req: Request, res: Response) => {
  res.send(videos)
})

videosRouter.post('/', [body('title').trim().notEmpty().isLength({
  min: 0,
  max: 40
}), body('author').trim().notEmpty().isLength({
  min: 0,
  max: 20,
}), body('availableResolutions.*').notEmpty()], (req: Request, res: Response) => {
  const error = validationResult(req).formatWith(({param, msg,}) => {
    return {
      message: msg,
      field: param
    }
  })
  const hasError = !error.isEmpty();

  const {title, author, availableResolutions} = req.body
  if (!hasError) {
    const newVideo = {
      title,
      author,
      availableResolutions,
      id: Math.floor(Math.random() * 100),
      canBeDownloaded: false,
      minAgeRestriction: Math.floor(Math.random() * 18),
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
    }
    res.status(201).send(newVideo);
    videos.push(newVideo);
    return;
  }

  const errors = {
    errorsMessages: error.array({onlyFirstError: true})
  }

  res.status(400).send(errors)
})


videosRouter.get('/:id', (req: Request, res: Response) => {
  const {id} = req.params
  const video = videos.find((item) => item.id === +id)
  if (video) {
    return res.send(video)
  }
  return res.sendStatus(404)
})

videosRouter.put<VideoType>('/:id',

  [body('title').trim().not().isEmpty().isLength({
    min: 1,
    max: 40
  }),
    body('author').not().isEmpty().trim().isLength({
      min: 1,
      max: 20,
    }),
    body('minAgeRestriction').not().isEmpty().trim().isLength({
      min: 1,
      max: 18,
    })], (req: Request<VideoType>, res: Response) => {
    const {
      id
    } = req.params;
    const {
      author,
      availableResolutions,
      minAgeRestriction,
      publicationDate,
      title,
      canBeDownloaded,
      createdAt
    } = req.body
    const video = videos.find((item) => item.id === +id)

    if (video) {
      const updatedVideo = {
        id: +id,
        title,
        author,
        availableResolutions,
        minAgeRestriction: +minAgeRestriction,
        publicationDate,
        canBeDownloaded,
        createdAt
      }
      const index = videos.indexOf(video);
      if (index > 0) {
        videos.splice(index, 1, updatedVideo)
        return res.send(204);
      }


    }
    const error = validationResult(req).formatWith(({param, msg,}) => {
      return {
        message: msg,
        field: param
      }
    })
    const hasError = !error.isEmpty();
    if (!video && !hasError) {
      return res.send(404);
    }

    return res.send({errorMessages: error.array({onlyFirstError: true})})
  })


videosRouter.delete('/:id', (req: Request, res: Response) => {
  const {id} = req.params
  let str = '';
  const video = videos.find((item) => item.id === +id)
  if (video) {
    const index = videos.indexOf(video);
    if (index > -1) {
      videos.splice(index, 1);
      return res.sendStatus(204)
    }
  }
  return res.status(404).send(404)
})