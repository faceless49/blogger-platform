import { PostType } from '../types/types';
import { v1 } from 'uuid';
import { commentsRepository } from '../repositories/commentsRepository';

export type CommentType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
};

export const commentsService = {
  async createComment(post: PostType, content: string): Promise<CommentType | null> {
    const comment: CommentType = {
      id: v1(),
      createdAt: new Date().toISOString(),
      userId: post.id,
      content,
      userLogin: post.blogName,
    };
    return await commentsRepository.createComment(comment);
  },
};
