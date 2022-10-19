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

  createPost(payload: Omit<PostType, "id" | "blogName">) {
    const newPost = {
      ...payload,
      id: '',
      blogId: ''
    }
    // posts.push(newPost);
    // return newPost
  },
  updatePostById(payload: PostType) {
    let post = posts.find(post => post.id === payload.id)
    if (post) {
     post = {
       ...payload
     }
      return true
    }
    return false
  }
}