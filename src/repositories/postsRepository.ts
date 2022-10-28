import { postsCollection } from './db';
import { PostType } from '../types';

export const postsRepository = {
  async deletePostById(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },

  async createPost(payload: PostType): Promise<PostType | null> {
    await postsCollection.insertOne(payload);
    return await postsCollection.findOne({ id: payload.id }, { projection: { _id: 0 } });
  },

  async updatePostById(
    payload: Omit<PostType, 'blogName' | 'createdAt'>,
  ): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { id: payload.id },
      {
        $set: {
          title: payload.title,
          shortDescription: payload.shortDescription,
          content: payload.content,
          blogId: payload.blogId,
        },
      },
    );
    return result.matchedCount === 1;
  },
};
