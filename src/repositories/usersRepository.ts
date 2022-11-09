import { usersCollection } from './db';
import { UserType } from '../types';

export const usersRepository = {
  async createUser(payload: UserType): Promise<UserType | null> {
    await usersCollection.insertOne(payload);
    return await usersCollection.findOne(
      { id: payload.id },
      { projection: { _id: 0, password: 0 } },
    );
  },
  async deleteUserById(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
};
