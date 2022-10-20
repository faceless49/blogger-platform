import { PostType } from '../types';

export let posts: PostType[] = []

export const postsRepository = {
  getPosts() {
    return posts
  },

  getPostById(id: string) {
    return posts.find((post) => post.id === id)
  },

  deletePostById(id: string) {
    const post = posts.find((post) => post.id === id)
    if (post) {
      const index = posts.indexOf(post)
      if (index > -1) {
        posts.splice(index, 1);
        return true
      }
    }
    return false
  },

  createPost(payload: Omit<PostType, 'id'>) {
    const newPost = {
      ...payload,
      id: Math.floor(Math.random() * 100).toString(),
    }
    posts.push(newPost);
    return newPost
  },
  updatePostById(payload: Omit<PostType, 'blogName'>) {
    let post = posts.find(post => post.id === payload.id)
    if (post) {
      post.title = payload.title
      post.shortDescription = payload.shortDescription
      post.content = payload.content
      post.blogId = payload.blogId
      return true
    }
    return false
  }
}