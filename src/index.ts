import express, { Request, Response } from 'express'
import { videosRouter } from './routes/videosRouter';
import { blogsRouter } from './routes/blogsRouter';
import { postsRouter } from './routes/postsRouter';
import { blogsCollection, postsCollection, runDb } from './repositories/db';


const app = express();
const port = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


app.get('/', (req: Request, res: Response) => {
  res.send('App is working')
})


app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsCollection.deleteMany({})
  await postsCollection.deleteMany({})
  res.sendStatus(204)
})


app.use('/videos', videosRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

const startApp = async () => {
  await runDb()

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}


startApp();