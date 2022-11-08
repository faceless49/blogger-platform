import { usersCollection } from './db';
import { UserType } from '../types';
import { RequestQueryType } from '../helpers/getPaginationData';

export type UsersOutputViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserType[];
};

export const usersQueryRepository = {
  async getUsers(reqParams: RequestQueryType): Promise<UsersOutputViewModel> {
    const { sortBy, sortDirection, pageSize, page, searchEmailTerm, searchLoginTerm } =
      reqParams;
    const filter = {
      $or: [
        { login: { $regex: searchLoginTerm } },
        { email: { $regex: searchEmailTerm } },
      ],
    };
    const users = await usersCollection
      .find(filter, { projection: { _id: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = (await usersCollection.find({}).toArray()).length;
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: users,
    };
  },

  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  },
};
