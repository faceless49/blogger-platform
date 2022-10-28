import {blogsCollection} from './db';
import {BlogType} from '../types';

export const blogRepository = {
  async deleteVideoById(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({id})
    return result.deletedCount === 1
  },

  async createBlog(newBlog: BlogType): Promise<BlogType | null> {
    await blogsCollection.insertOne(newBlog)
    return await blogsCollection.findOne({id: newBlog.id}, {projection: {_id: 0}})
  },
  async updateVideoById({
    id,
    name, youtubeUrl
  }: Omit<BlogType, 'createdAt'>) {
    const result = await blogsCollection.updateOne({id}, {
      $set: {
        name,
        youtubeUrl,
      }
    });
    return result.matchedCount === 1
  }
}