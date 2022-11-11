import { UserType } from '../types/types';
import jwt from 'jsonwebtoken';

export const jwtService = {
  async createJWT(user: UserType) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '1234', {
      expiresIn: '1h',
    });
    return token;
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET || '1234');
      return result.userId;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
