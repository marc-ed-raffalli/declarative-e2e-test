import {post} from 'superagent';
import {ILoginPayload} from '../routes/auth/login';
import {routes, SERVER_URL} from './global-test-config';

export function sendLogin(credentials: ILoginPayload): Promise<string> {
  return post(`${SERVER_URL}${routes.login}`)
    .send(credentials)
    .then(resp => resp.body.token);
}

export interface ITestData {
  token: string;
}

export const
  hooks = {
    resetDemoTestData: () =>
      post(`${SERVER_URL}${routes.resetTestData}`),

    setTokenForUser: (user: ILoginPayload) =>
      async function (this: ITestData) {
        this.token = await sendLogin(user);
      }
  };

export function getAuthorizationHeaders(this: ITestData) {
  // token is stored in the context in the beforeEach
  // the token should be invalidated
  return {authorization: this.token};
}
