import { commentsCollection } from './db';
import { CommentType } from '../types/types';

export const commentsRepository = {
  async createComment(payload: CommentType): Promise<CommentType | null> {
    await commentsCollection.insertOne(payload);
    return await commentsCollection.findOne(
      { id: payload.id },
      { projection: { _id: 0, postId: 0 } },
    );
  },
  async deleteCommentById(id: string): Promise<boolean | null> {
    const result = await commentsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },

  async updateCommentById(id: string, content: string): Promise<boolean | null> {
    const result = await commentsCollection.updateOne(
      { id },
      {
        $set: {
          content,
        },
      },
    );
    return result.matchedCount === 1;
  },
};
