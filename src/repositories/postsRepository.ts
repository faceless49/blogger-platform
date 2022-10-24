import { PostType } from '../types';
import { postsCollection } from './db';

export const postsRepository = {
  async getPosts(): Promise<PostType[]> {
    return await postsCollection.find({}).toArray()
  },

  async getPostById(id: string): Promise<PostType | null> {
    return await postsCollection.findOne({id});
  },

  async deletePostById(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({id})
    return result.deletedCount === 1
  },

  async createPost
  (payload: Omit<PostType, 'id'>): Promise<PostType> {
    const newPost = {
      ...payload,
      id: Math.floor(Math.random() * 100).toString(),
    }
    await postsCollection.insertOne(newPost)
    return newPost
  },

  async updatePostById(payload: Omit<PostType, 'blogName'>): Promise<boolean> {

    const result = await postsCollection.updateOne({id: payload.id}, {
      $set: {
        title: payload.title,
        shortDescription: payload.shortDescription,
        content: payload.content,
        blogId: payload.blogId
      }
    });
    return result.matchedCount === 1
  }
}