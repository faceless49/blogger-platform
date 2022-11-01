import { postsCollection } from './db';
import { PostsOutputViewModel } from '../domain/posts-service';
import { PostType } from '../types';
import { RequestQueryType } from '../helpers/getPaginationData';

export const postsQueryRepository = {
  async getPosts(reqParams: RequestQueryType): Promise<PostsOutputViewModel> {
    const { searchNameTerm, sortBy, sortDirection, pageSize, page } = reqParams;
    const filter = {
      blogName: { $regex: searchNameTerm ? searchNameTerm : '', $options: 'i' },
    };
    const posts = await postsCollection
      .find(filter, { projection: { _id: 0 } })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort(sortBy, sortDirection)
      .toArray();

    const totalCount = (await postsCollection.find(filter).toArray()).length;
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
