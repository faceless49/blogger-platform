import { BlogType } from '../types';
import { blogsCollection } from './db';

export const blogRepository = {
  async getBlogs(): Promise<BlogType[]> {
    return blogsCollection.find({}).toArray();
  },

  async getBlogById(id: string): Promise<BlogType | null> {
    return await blogsCollection.findOne({id});
  },

  async deleteVideoById(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({id})
    return result.deletedCount === 1
  },

  async createBlog(name: string, youtubeUrl: string): Promise<BlogType> {
    const newBlog: BlogType = {
      id: Math.floor(Math.random() * 100).toString(),
      createdAt: new Date().toISOString(),
      name,
      youtubeUrl,
    }
    await blogsCollection.insertOne(newBlog)
    return newBlog
  },
  async updateVideoById({
    id,
    name, youtubeUrl
  }: Omit<BlogType, "createdAt">) {
    const result = await blogsCollection.updateOne({id}, {
      $set: {
        name,
        youtubeUrl,
      }
    });
    return result.matchedCount === 1
  }
}