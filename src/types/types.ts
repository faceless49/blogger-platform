export type VideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: null | number;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Resolutions[];
};

export type BlogType = {
  id: string;
  name: string;
  websiteUrl: string;
  createdAt: string;
  description: string;
};
export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export const enum Resolutions {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160',
}

export type UserType = {
  id: string;
  login: string;
  email: string;
  password: string;
  createdAt?: string;
};

export type CommentType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  postId?: string;
};
