import { MongoClient } from 'mongodb'
import { BlogType, PostType, VideoType } from '../types';
import 'dotenv/config'
const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017'

const client = new MongoClient(mongoUri)
const db = client.db('heroDb');
export const postsCollection = db.collection<PostType>('posts')
export const blogsCollection = db.collection<BlogType>('blogs')
export const videosCollection = db.collection<VideoType>('videos')

export async function runDb() {
  console.log('run DB')
  try {
    await client.connect()
    console.log('Connected success to mongo server');
  } catch (e) {
    console.log('Can"t connect to server',e);
    await client.close()
  }
}