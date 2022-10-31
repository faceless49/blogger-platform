import { blogsCollection, postsCollection } from './db';
import { BlogType } from '../types';
import { RequestQueryType } from '../helpers/getPaginationData';
import { BlogsOutputViewModel, PostsOutputViewModel } from '../domain/blogs-service';

export const blogQueryRepository = {
  async getBlogs(reqParams: RequestQueryType): Promise<BlogsOutputViewModel> {
    const { searchNameTerm, sortBy, sortDirection, pageSize, page } = reqParams;
    const filter = {
      name: { $regex: searchNameTerm ? searchNameTerm : '', $options: 'i' },
    };
    const blogs = await blogsCollection
      .find(filter, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
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
    const { sortBy, sortDirection, pageSize, page, searchNameTerm } = reqParams;
    const posts = await postsCollection
      .find({ blogId: id }, { projection: { _id: 0 } })
      .sort(sortBy, sortDirection)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const totalCount = (await postsCollection.find({ blogId: id }).toArray()).length;

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
