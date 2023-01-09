import { app } from '../index';
import request from 'supertest';
import { authRouter } from '../routes/authRouter';

describe('', () => {
  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(204);
  });

  it('registration in the system', async () => {
    await request(authRouter)
      .post('/registration')
      .send({
        password: 'qwerty123',
        email: 'ekolesnikovnbcom@gmail.com',
        login: 'loginas34',
      })
      .expect(204);
  });
});
