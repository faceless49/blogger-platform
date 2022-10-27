import {PostType} from '../types';
import {postsRepository} from '../repositories/postsRepository';

export const postsService = {
  async getPosts(): Promise<PostType[]> {
    return await postsRepository.getPosts();
  },

  async getPostById(id: string): Promise<PostType | null> {
    return await postsRepository.getPostById(id)
  },

  async deletePostById(id: string): Promise<boolean> {
    return await postsRepository.deletePostById(id)
  },

  async createPost(payload: Omit<PostType, 'id' | 'createdAt'>): Promise<PostType | null> {
    const newPost = {
      ...payload,
      id: Math.floor(Math.random() * 100).toString(),
      createdAt: new Date().toISOString(),
    }
    return await postsRepository.createPost(newPost)
  },

  async updatePostById(payload: Omit<PostType, 'blogName' | 'createdAt'>): Promise<boolean> {
    return await postsRepository.updatePostById(payload)
  }
}