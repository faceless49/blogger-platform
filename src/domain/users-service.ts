import { UserType } from '../types';
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
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
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
    const passwordHash = await this._generateHash(password, user.password!);
    if (user.password !== passwordHash) {
      return false;
    }
    return true;
  },

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },
};
