import { blogsCollection, postsCollection } from './db';
import { BlogType } from '../types';
import { RequestQueryType } from '../helpers/getPaginationData';
import { BlogsOutputViewModel, PostsOutputViewModel } from '../domain/blogs-service';

export const blogQueryRepository = {
  async getBlogs(reqParams: RequestQueryType): Promise<BlogsOutputViewModel> {
    const { searchNameTerm, sortBy, sortDirection, pageSize, page } = reqParams;
    const filter = { name: { $regex: searchNameTerm ? searchNameTerm : '' } };
    const blogs = await blogsCollection
      .find(filter, { projection: { _id: 0 } })
      .sort(sortBy, sortDirection)
      .toArray();

    const totalCount = blogs.length;
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
      .sort(sortBy, sortDirection)
      .toArray();
    const totalCount = posts.length;
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