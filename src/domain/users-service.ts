import { UserDBType, UserType } from '../types/types';
import { v1, v4 } from 'uuid';
import { usersRepository } from '../repositories/usersRepository';
import bcrypt from 'bcrypt';
import { usersQueryRepository } from '../repositories/usersQueryRepository';
import add from 'date-fns/add';
import { emailManager } from '../managers/emailManager';

export const usersService = {
  async createUser(
    login: string,
    password: string,
    email: string,
  ): Promise<UserType | null> {
    const passwordHash = await this._generateHash(password);
    const newUser: UserDBType = {
      id: v1(),
      createdAt: new Date().toISOString(),
      login,
      password: passwordHash,
      email,
      emailConfirmation: {
        confirmationCode: v4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };
    const createResult = await usersRepository.createUser(newUser);
    try {
      await emailManager.sendEmailConfirmationMessage(newUser);
    } catch (e) {
      console.error(e);
      await usersRepository.deleteUserById(newUser.id);
      return null;
    }
    return createResult;
  },

  async deleteUserById(id: string): Promise<boolean> {
    return await usersRepository.deleteUserById(id);
  },

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDBType | null> {
    const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    if (user?.emailConfirmation?.isConfirmed) return null;
    const res = await bcrypt.compare(password, user.password);
    if (res) {
      return user;
    }
    return null;
  },

  async _generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  },

  async confirmEmail(code: string): Promise<boolean | null> {
    const user = await usersQueryRepository.getUserByCode(code);
    if (!user) return false;
    if (user.emailConfirmation!.confirmationCode !== code) return false;
    if (user.emailConfirmation!.expirationDate! < new Date()) return false;
    if (user.emailConfirmation?.isConfirmed) return false;

    return await usersRepository.updateConfirmation(user.id);
  },

  async resendEmail(email: string): Promise<boolean | void> {
    const user = await usersQueryRepository.findByLoginOrEmail(email);
    if (user?.emailConfirmation?.isConfirmed) return false;

    if (user && !user.emailConfirmation?.isConfirmed) {
      const code = v4();
      await emailManager.sendResendEmailRegistration(user, code);
      await usersRepository.updateEmailConfirmationCode(user.id, code);
      return true;
    }
    return false;
  },
};
