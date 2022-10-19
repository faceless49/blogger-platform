import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videosRouter';
import { blogsRouter } from './routes/blogsRouter';
import { postsRouter } from './routes/postsRouter';


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
  res.sendStatus(204)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/videos', videosRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)