import { commentsCollection } from './db';
import { RequestQueryType } from '../helpers/getPaginationData';
import { CommentType } from '../types/types';

export type OutputViewModelComment = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentType[];
};

export const commentsQueryRepository = {
  async getCommentsByPostId(
    postId: string,
    reqParams: RequestQueryType,
  ): Promise<OutputViewModelComment> {
    const { sortBy, sortDirection, pageSize, page } = reqParams;
    const comments = await commentsCollection
      .find({ postId }, { projection: { _id: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await commentsCollection.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: comments,
    };
  },

  async getCommentById(id: string): Promise<CommentType | null> {
    return await commentsCollection.findOne({ id }, { projection: { _id: 0 } });
  },
};
