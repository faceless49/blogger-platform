import { MongoClient } from 'mongodb';
import { BlogType, PostType, UserType } from '../types/types';
import 'dotenv/config';
import { CommentType } from '../domain/comments-service';

const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017';

const client = new MongoClient(mongoUri);
const db = client.db('heroDb');
export const postsCollection = db.collection<PostType>('posts');
export const blogsCollection = db.collection<BlogType>('blogs');
export const usersCollection = db.collection<UserType>('users');
export const commentsCollection = db.collection<CommentType>('comments');

export async function runDb() {
  console.log('run DB');
  try {
    await client.connect();
    console.log('Connected success to mongo server');
  } catch (e) {
    console.log('Can"t connect to server', e);
    await client.close();
  }
}
