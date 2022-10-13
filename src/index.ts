import express, { Request, Response } from 'express'
import bodyParser from 'body-parser';
import { videosRouter } from './routes/videosRouter';

const app = express();
const port = process.env.PORT || 4000;
const parser = bodyParser({})

app.use(parser)

app.get('/', (req: Request, res: Response) => {
  res.send('App is working')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/videos', videosRouter)