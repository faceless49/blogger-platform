import { UserType } from '../types/types';
import { v1 } from 'uuid';
import { usersRepository } from '../repositories/usersRepository';
import bcrypt from 'bcrypt';
import { usersQueryRepository } from '../repositories/usersQueryRepository';

export const usersService = {
  async createUser(
    login: string,
    password: string,
    email: string,
  ): Promise<UserType | null> {
    const passwordHash = await this._generateHash(password);
    const newUser = {
      id: v1(),
      createdAt: new Date().toISOString(),
      login,
      password: passwordHash,
      email,
    };
    return await usersRepository.createUser(newUser);
  },

  async deleteUserById(id: string): Promise<boolean> {
    return await usersRepository.deleteUserById(id);
  },

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const res = await bcrypt.compare(password, user.password);
    if (res) {
      return user;
    }
    return false;
  },

  async _generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  },
};
