import { BlogType, PostType } from '../types/types';
import { blogRepository } from '../repositories/blogRepository';
import { blogQueryRepository } from '../repositories/blogQueryRepository';
import { RequestQueryType } from '../helpers/getPaginationData';
import { postsRepository } from '../repositories/postsRepository';
import { v1 } from 'uuid';
// * No DB actions

export type BlogsOutputViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogType[];
};
export type PostsOutputViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostType[];
};
export const blogsService = {
  async getBlogs(reqParams: RequestQueryType): Promise<BlogsOutputViewModel> {
    return blogQueryRepository.getBlogs(reqParams);
  },

  async getBlogById(id: string): Promise<BlogType | null> {
    return await blogQueryRepository.getBlogById(id);
  },

  async getPostsByBlogId(
    reqParams: RequestQueryType,
    id: string,
  ): Promise<PostsOutputViewModel | null> {
    return await blogQueryRepository.getPostsByBlogId(reqParams, id);
  },

  async deleteVideoById(id: string): Promise<boolean> {
    return await blogRepository.deleteVideoById(id);
  },

  async createBlog(
    name: string,
    webSiteUrl: string,
    description: string,
  ): Promise<BlogType | null> {
    const newBlog: BlogType = {
      id: v1(),
      createdAt: new Date().toISOString(),
      name,
      webSiteUrl,
      description,
    };
    return await blogRepository.createBlog(newBlog);
  },

  async updateVideoById({
    id,
    name,
    webSiteUrl,
    description,
  }: Omit<BlogType, 'createdAt'>) {
    return await blogRepository.updateVideoById({ id, name, webSiteUrl, description });
  },

  async createPostByBlogId(
    blog: BlogType,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<PostType | null> {
    const newPost = {
      title,
      shortDescription,
      content,
      id: v1(),
      createdAt: new Date().toISOString(),
      blogId: blog.id,
      blogName: blog.name,
    };
    return await postsRepository.createPost(newPost);
  },
};
