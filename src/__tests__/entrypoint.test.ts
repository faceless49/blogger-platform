import app, { app as namedApp } from '../index';

describe('deployment entrypoint', () => {
  it('default-exports the Express server', () => {
    expect(app).toBe(namedApp);
    expect(typeof app).toBe('function');
  });
});
