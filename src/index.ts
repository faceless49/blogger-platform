import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videosRouter';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req: Request, res: Response) => {
  res.send('App is working')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/videos', videosRouter)