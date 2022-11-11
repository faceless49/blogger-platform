import { commentsCollection } from './db';
import { CommentType } from '../domain/comments-service';
import { RequestQueryType } from '../helpers/getPaginationData';

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
      .find({ userId: postId }, { projection: { _id: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = comments.length;
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: comments,
    };
  },
};
