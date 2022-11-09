import express, { Request, Response } from 'express';
import { blogsRouter } from './routes/blogsRouter';
import {
  blogsCollection,
  postsCollection,
  runDb,
  usersCollection,
} from './repositories/db';
import { postsRouter } from './routes/postsRouter';
import { videosRouter } from './routes/videosRouter';
import { usersRouter } from './routes/usersRouter';
import { authRouter } from './routes/authRouter';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get('/', (req: Request, res: Response) => {
  res.send('App is working');
});

app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  await usersCollection.deleteMany({});
  res.sendStatus(204);
});

app.use('/auth', authRouter);
app.use('/videos', videosRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

const startApp = async () => {
  await runDb();

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
