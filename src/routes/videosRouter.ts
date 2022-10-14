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

  .post('/', [body('title').trim().notEmpty().isString().isLength({
    min: 0,
    max: 40
  }), body('author').trim().notEmpty().isLength({
    min: 0,
    max: 20,
  }),
    body('availableResolutions').isArray().optional({nullable: true}).custom((value) => {
      value.forEach((el: any) => {
        if (el == 'P144' || el == 'P240' || el == 'P360' || el == 'P480' || el == 'P720' || el == 'P1080' || el == 'P1440' || el == 'P2160') {
          return true
        }
        throw new Error('The el is required')
      });
      return true;
    })], (req: Request, res: Response) => {
    const error = validationResult(req).formatWith(({param, msg,}) => {
      return {
        message: msg,
        field: param
      }
    })
    const hasError = !error.isEmpty();
    const {title, author} = req.body
    if (!hasError) {
      const newVideo: VideoType = {
        title,
        author,
        availableResolutions: req.body.availableResolutions,
        id: Math.floor(Math.random() * 100),
        canBeDownloaded: false,
        minAgeRestriction: null,
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


  .get('/:id', (req: Request, res: Response) => {
    const {id} = req.params
    const video = videos.find((item) => item.id === +id)
    if (video) {
      return res.send(video)
    }
    return res.sendStatus(404)
  })

  .put<VideoType>('/:id',
    [body('title').trim().notEmpty().isString().isLength({
      min: 0,
      max: 40
    }),
      body('author').trim().notEmpty().isString().isLength({
        min: 1,
        max: 20,
      }),
      body('minAgeRestriction').trim().notEmpty().isFloat({ min: 1, max: 18 }).optional({nullable: true}),
      body('availableResolutions.*').trim().notEmpty().isString().optional({nullable: true}),
      body('canBeDownloaded').isBoolean()],
    (req: Request<VideoType>, res: Response) => {
      const {
        id
      } = req.params;
      const {
        author,
        availableResolutions,
        minAgeRestriction = null,
        title,
        canBeDownloaded = false,
      } = req.body
      const video = videos.find((item) => item.id === +id)
      const error = validationResult(req).formatWith(({param, msg,}) => {
        return {
          message: msg,
          field: param
        }
      })
      const hasError = !error.isEmpty();
      if (video) {
        const updatedVideo = {
          id: +id,
          title,
          author,
          availableResolutions,
          minAgeRestriction: +minAgeRestriction,
          publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
          canBeDownloaded,
          createdAt: new Date().toISOString()
        }
        const index = videos.indexOf(video);
        if (index > 0 && !hasError) {
          videos.splice(index, 1, updatedVideo)
          return res.send(204);
        }
      }

      if (!video && !hasError) {
        return res.send(404);
      }

      return res.status(400).send({errorsMessages: error.array({onlyFirstError: true})})
    })


  .delete('/:id', (req: Request, res: Response) => {
    const {id} = req.params
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