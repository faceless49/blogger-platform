import { usersCollection } from './db';
import { UserDBType, UserType } from '../types/types';
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
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ],
    };

    const users = await usersCollection
      .find(filter, { projection: { _id: 0, password: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: users,
    };
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    return await usersCollection.findOne(
      {
        $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
      },
      { projection: { _id: 0 } },
    );
  },

  async getUserById(id: string): Promise<UserDBType | null> {
    return await usersCollection.findOne({ id }, { projection: { _id: 0 } });
  },
  async getUserByCode(code: string): Promise<UserDBType | null> {
    return await usersCollection.findOne(
      { 'emailConfirmation.confirmationCode': code },
      { projection: { _id: 0 } },
    );
  },
};
