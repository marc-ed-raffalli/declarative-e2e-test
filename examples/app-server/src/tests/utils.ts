import {ILoginPayload} from '../routes/auth/login';
import {login, resetInMemoryTestDB} from '../services';

export interface ITestData {
  token: string;
}

export const
  hooks = {
    resetDemoTestData: () => resetInMemoryTestDB,

    setTokenForUser: (user: ILoginPayload) =>
      async function (this: ITestData) {
        this.token = await login(user.username, user.password) as string;
      }
  };

export function getAuthorizationHeaders(this: ITestData) {
  // token is stored in the context in the beforeEach
  // the token should be invalidated
  return {authorization: this.token};
}
