import {postsCollection} from './db';
import {PostsOutputViewModel} from '../domain/posts-service';
import {PostType} from '../types';
import {RequestQueryType} from '../helpers/getPaginationData';


export const postsRepository = {
  async getPosts(reqParams: RequestQueryType): Promise<PostsOutputViewModel> {
    const {searchNameTerm, sortBy, sortDirection, pageSize, page} = reqParams
    const filter = {name: {$regex: searchNameTerm ? searchNameTerm : ''}}
    const posts: PostType[] = '';

    const totalCount = (await postsCollection.find(filter).toArray()).length
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: posts
    }
  },

  async getPostById(id: string): Promise<PostType | null> {
    return await postsCollection.findOne({id}, {projection: {_id: 0}});
  },

  async deletePostById(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({id})
    return result.deletedCount === 1
  },

  async createPost(payload: PostType): Promise<PostType | null> {
    await postsCollection.insertOne(payload)
    return await postsCollection.findOne({id: payload.id}, {projection: {_id: 0}})
  },

  async updatePostById(payload: Omit<PostType, 'blogName' | 'createdAt'>): Promise<boolean> {

    const result = await postsCollection.updateOne({id: payload.id}, {
      $set: {
        title: payload.title,
        shortDescription: payload.shortDescription,
        content: payload.content,
        blogId: payload.blogId
      }
    });
    return result.matchedCount === 1
  }
}