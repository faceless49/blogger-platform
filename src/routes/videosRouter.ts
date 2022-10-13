import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

type VideoType = {
  id: number,
  title: string,
  author: string,
  canBeDownloaded: boolean,
  minAgeRestriction: null | number,
  createdAt: string,
  publicationDate: string,
  availableResolutions: string[]
}

let videos: VideoType[] = [
  {
    id: 0,
    title: 'id0',
    author: 'me',
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: [
      'P144'
    ]
  },
  {
    id: 1,
    title: 'id1',
    author: 'me',
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
    availableResolutions: [
      'P144'
    ]
  },
]

export const videosRouter = Router({})

videosRouter.delete('/testing/all-data', (req: Request, res: Response) => {
  videos = []
  res.sendStatus(204)
})
videosRouter.get('/', (req: Request, res: Response) => {
  res.send(200)
})

videosRouter.post('/', [body('title').trim().not().isEmpty().isLength({
  min: 0,
  max: 40
}), body('author').not().isEmpty().trim().isLength({
  min: 0,
  max: 20,
})], (req: Request, res: Response) => {


  const {title, author, availableResolutions} = req.body
  if (title && author && availableResolutions) {
    const newVideo = {
      title,
      author,
      availableResolutions,
      id: 3,
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
    }
    videos.push(newVideo);
    return res.send(newVideo)
  }

  const error = validationResult(req).formatWith(({param, msg,}) => {
    return {
      message: msg,
      field: param
    }
  })

  res.send(error.array({onlyFirstError: true}))
})


videosRouter.get('/:id', (req: Request, res: Response) => {
  const {id} = req.params
  const video = videos.find((item) => item.id === +id)
  if (video) {
    return res.send(video)
  }
  return res.send(404)
})

videosRouter.put<VideoType>('/:id', [body('title').trim().not().isEmpty().isLength({
  min: 0,
  max: 40
}),
  body('author').not().isEmpty().trim().isLength({
    min: 0,
    max: 20,
  }),
  body('minAgeRestriction').not().isEmpty().trim().isLength({
    min: 1,
    max: 18,
  })], (req: Request<VideoType>, res: Response) => {
  const {
    id,
    author,
    availableResolutions,
    minAgeRestriction,
    publicationDate,
    title,
    canBeDownloaded,
    createdAt
  } = req.params
  let video = videos.find((item) => item.id === +id)
  if (video) {
    video = {
      ...video,
      author,
      availableResolutions,
      minAgeRestriction,
      publicationDate,
      title,
      canBeDownloaded,
      createdAt
    }
    return res.sendStatus(204)
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

  return res.send(error.array({onlyFirstError: true}))
})


videosRouter.delete('/:id', (req: Request, res: Response) => {
  const {id} = req.params
  const video = videos.find((item) => item.id === +id)
  if (video) {
    const index = videos.indexOf(video);
    if (index > -1) {
      videos.splice(index, 1);
    }
    return res.send(204)
  }
  return res.send(404)
})