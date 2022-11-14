import { CommentType, PostType } from '../types/types';
import { v1 } from 'uuid';
import { commentsRepository } from '../repositories/commentsRepository';
import {
  commentsQueryRepository,
  OutputViewModelComment,
} from '../repositories/commentsQueryRepository';
import { RequestQueryType } from '../helpers/getPaginationData';

export const commentsService = {
  async createComment(
    post: PostType,
    content: string,
    userId: string,
    login: string,
  ): Promise<CommentType | null> {
    const comment: CommentType = {
      id: v1(),
      createdAt: new Date().toISOString(),
      userId,
      content,
      userLogin: login,
    };
    return await commentsRepository.createComment(comment);
  },

  async getCommentsByPostId(
    userLogin: string,
    reqParams: RequestQueryType,
  ): Promise<OutputViewModelComment | null> {
    return await commentsQueryRepository.getCommentsByPostId(userLogin, reqParams);
  },

  async deleteCommentById(id: string): Promise<boolean | null> {
    return await commentsRepository.deleteCommentById(id);
  },

  async updateCommentById(id: string, content: string): Promise<boolean | null> {
    return await commentsRepository.updateCommentById(id, content);
  },
};
