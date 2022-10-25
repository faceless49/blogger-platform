import { PostType } from '../types';
import { blogsCollection, postsCollection } from './db';

export const postsRepository = {
  async getPosts(): Promise<PostType[]> {
    return await postsCollection.find({},{projection: {_id: 0}}).toArray()
  },

  async getPostById(id: string): Promise<PostType | null> {
    return await postsCollection.findOne({id},{projection: {_id: 0}});
  },

  async deletePostById(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({id})
    return result.deletedCount === 1
  },

  async createPost
  (payload: Omit<PostType, 'id' | 'createdAt'>): Promise<PostType | null> {
    const newPost = {
      ...payload,
      id: Math.floor(Math.random() * 100).toString(),
      createdAt: new Date().toISOString(),
    }
    await postsCollection.insertOne(newPost)
    return await postsCollection.findOne({id: newPost.id}, {projection: {_id: 0}})
  },

  async updatePostById(payload: Omit<PostType, 'blogName' | "createdAt">): Promise<boolean> {

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