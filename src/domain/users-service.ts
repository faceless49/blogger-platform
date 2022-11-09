import { UserOutputViewModel } from '../types';
import { v1 } from 'uuid';
import { usersRepository } from '../repositories/usersRepository';
import bcrypt from 'bcrypt';
import { usersQueryRepository } from '../repositories/usersQueryRepository';

export const usersService = {
  async createUser(
    login: string,
    password: string,
    email: string,
  ): Promise<UserOutputViewModel | null> {
    const passwordHash = await this._generateHash(password);
    const newUser = {
      id: v1(),
      createdAt: new Date().toISOString(),
      login,
      password: passwordHash,
      email,
    };
    const outputNewUser: UserOutputViewModel = {
      id: newUser.id,
      createdAt: newUser.createdAt,
      email: newUser.email,
      login: newUser.login,
    };
    const result = await usersRepository.createUser(newUser);
    return result ? outputNewUser : null;
  },

  async deleteUserById(id: string): Promise<boolean> {
    return await usersRepository.deleteUserById(id);
  },

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  },

  async _generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  },
};
