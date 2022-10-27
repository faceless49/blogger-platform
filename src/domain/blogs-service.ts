import {BlogType} from '../types';
import {blogRepository} from '../repositories/blogRepository';
// * No DB actions


export const blogsService = {
  async getBlogs(): Promise<BlogType[]> {
    return blogRepository.getBlogs()
  },

  async getBlogById(id: string): Promise<BlogType | null> {
    return await blogRepository.getBlogById(id);
  },

  async deleteVideoById(id: string): Promise<boolean> {
    return await blogRepository.deleteVideoById(id)
  },

  async createBlog(name: string, youtubeUrl: string): Promise<BlogType | null> {
    const newBlog: BlogType = {
      id: Math.floor(Math.random() * 100).toString(),
      createdAt: new Date().toISOString(),
      name,
      youtubeUrl,
    }
    return await blogRepository.createBlog(newBlog)
  },
  async updateVideoById({
    id,
    name, youtubeUrl
  }: Omit<BlogType, 'createdAt'>) {
    return await blogRepository.updateVideoById({id, name, youtubeUrl});
  }
}