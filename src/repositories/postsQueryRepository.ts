import { postsCollection } from './db';
import { PostsOutputViewModel } from '../domain/posts-service';
import { PostType } from '../types';
import { RequestQueryType } from '../helpers/getPaginationData';

export const postsQueryRepository = {
  async getPosts(reqParams: RequestQueryType): Promise<PostsOutputViewModel> {
    const { sortBy, sortDirection, pageSize, page } = reqParams;
    console.log(reqParams);
    const posts = await postsCollection
      .find({}, { projection: { _id: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = (await postsCollection.find({}).toArray()).length;
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: posts,
    };
  },

  async getPostById(id: string): Promise<PostType | null> {
    return await postsCollection.findOne({ id }, { projection: { _id: 0 } });
  },
};
