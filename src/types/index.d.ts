import { UserType } from './index';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserType | null;
    }
  }
}
