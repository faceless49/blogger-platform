import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videosRouter';

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
export let videos: VideoType[] = [
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

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req: Request, res: Response) => {
  res.send('App is working')
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
  videos = []
  res.sendStatus(204).send(videos)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/videos', videosRouter)