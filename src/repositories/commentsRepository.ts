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
  async deleteCommentById(id: string): Promise<boolean | null> {
    const result = await commentsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
};
