import { PostType } from '../types';
import { postsRepository } from '../repositories/postsRepository';
import { RequestQueryType } from '../helpers/getPaginationData';
import { postsQueryRepository } from '../repositories/postsQueryRepository';

export type PostsOutputViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostType[];
};

export const postsService = {
  async getPosts(reqParams: RequestQueryType): Promise<PostsOutputViewModel> {
    return await postsQueryRepository.getPosts(reqParams);
  },

  async getPostById(id: string): Promise<PostType | null> {
    return await postsQueryRepository.getPostById(id);
  },

  async deletePostById(id: string): Promise<boolean> {
    return await postsRepository.deletePostById(id);
  },

  async createPost(
    payload: Omit<PostType, 'id' | 'createdAt'>,
  ): Promise<PostType | null> {
    const newPost = {
      ...payload,
      id: Math.floor(Math.random() * 100).toString(),
      createdAt: new Date().toISOString(),
    };
    return await postsRepository.createPost(newPost);
  },

  async updatePostById(
    payload: Omit<PostType, 'blogName' | 'createdAt'>,
  ): Promise<boolean> {
    return await postsRepository.updatePostById(payload);
  },
};
