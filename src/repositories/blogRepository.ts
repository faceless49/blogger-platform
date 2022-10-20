import { BlogType } from '../types';

export let blogs: BlogType[] = []

export const blogRepository = {
  getBlogs() {
    return blogs
  },

  getBlogById(id: string) {
    return blogs.find((blog) => blog.id === id)
  },

  deleteVideoById(id: string) {
    const blog = blogs.find((blog) => blog.id === id)
    if (blog) {
      const index = blogs.indexOf(blog)
      if (index > -1) {
        blogs.splice(index, 1);
        return true
      }
    }
    return false
  },

  createBlog(name: string, youtubeUrl: string) {
    const newBlog: BlogType = {
      id: Math.floor(Math.random() * 100).toString(),
      name,
      youtubeUrl
    }
    blogs.push(newBlog);
    return newBlog
  },
  updateVideoById({
    id,
    name, youtubeUrl
  }: BlogType) {
    const blog = blogs.find(blog => blog.id === id)
    if (blog) {
        blog.name = name;
        blog.youtubeUrl = youtubeUrl;
      return true
    }
    return false
  }
}