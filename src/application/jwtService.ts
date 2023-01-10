import { UserType } from '../types/types';
import jwt from 'jsonwebtoken';

export const jwtService = {
  async createJwtTokensPair(userId: string) {
    const secretKey = process.env.JWT_SECRET_KEY || 'topSecretKey';
    const payload: { userId: string; date: Date } = { userId, date: new Date() };
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: '10s' });
    const refreshToken = jwt.sign(payload, secretKey, { expiresIn: '20s' });
    return {
      accessToken,
      refreshToken,
    };
  },
  async createAccessToken(user: UserType) {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '1234', {
      expiresIn: '20000',
    });
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
