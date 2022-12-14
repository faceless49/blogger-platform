import { blogsCollection, postsCollection } from './db';
import { BlogType } from '../types/types';
import { RequestQueryType } from '../helpers/getPaginationData';
import { BlogsOutputViewModel, PostsOutputViewModel } from '../domain/blogs-service';

export const blogQueryRepository = {
  async getBlogs(reqParams: RequestQueryType): Promise<BlogsOutputViewModel> {
    const { searchNameTerm, sortBy, sortDirection, pageSize, page } = reqParams;
    const filter = {
      name: { $regex: searchNameTerm, $options: 'i' },
    };
    const blogs = await blogsCollection
      .find(filter, { projection: { _id: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = (await blogsCollection.find(filter).toArray()).length;
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: blogs,
    };
  },

  async getBlogById(id: string): Promise<BlogType | null> {
    return await blogsCollection.findOne({ id }, { projection: { _id: 0 } });
  },
  async getPostsByBlogId(
    reqParams: RequestQueryType,
    id: string,
  ): Promise<PostsOutputViewModel | null> {
    const { sortBy, sortDirection, pageSize, page } = reqParams;
    const posts = await postsCollection
      .find({ blogId: id }, { projection: { _id: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();
    const totalCount = await postsCollection.countDocuments({ blogId: id });

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: posts,
    };
  },
};
