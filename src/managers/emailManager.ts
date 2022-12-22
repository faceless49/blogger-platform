import { emailAdapter } from '../adapters/emailAdapter';
import { UserDBType, UserType } from '../types/types';

export const emailManager = {
  async sendEmailRecoveryMsg(user: UserType) {
    await emailAdapter.sendEmail(
      user.email,
      user.password,
      `<div>${user.login} ссылка для восстановления пароля</div>`,
    );
  },

  async sendEmailRegistration(login: string, email: string) {
    await emailAdapter.sendEmail(
      email,
      `Registration`,
      `<div>${login} ссылка для восстановления пароля</div>`,
    );
  },

  async sendEmailConfirmationMessage(user: UserDBType) {
    await emailAdapter.sendEmail(
      user.email,
      `Registration`,
      ` <h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation?.confirmationCode}'>complete registration</a>
      </p>`,
    );
  },
};
