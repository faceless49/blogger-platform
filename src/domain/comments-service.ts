import { PostType } from '../types/types';
import { v1 } from 'uuid';
import { commentsRepository } from '../repositories/commentsRepository';
import {
  commentsQueryRepository,
  OutputViewModelComment,
} from '../repositories/commentsQueryRepository';
import { RequestQueryType } from '../helpers/getPaginationData';

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

  async getCommentsByPostId(
    postId: string,
    reqParams: RequestQueryType,
  ): Promise<OutputViewModelComment | null> {
    return await commentsQueryRepository.getCommentsByPostId(postId, reqParams);
  },

  async deleteCommentById(id: string): Promise<boolean | null> {
    return await commentsRepository.deleteCommentById(id);
  },

  async updateCommentById(id: string, content: string): Promise<boolean | null> {
    return await commentsRepository.updateCommentById(id, content);
  },
};
