import { commentsCollection } from './db';
import { CommentType } from '../domain/comments-service';

export const commentsRepository = {
  async createComment(payload: CommentType): Promise<CommentType | null> {
    await commentsCollection.insertOne(payload);
    return await commentsCollection.findOne(
      { id: payload.id },
      { projection: { _id: 0 } },
    );
  },
};
