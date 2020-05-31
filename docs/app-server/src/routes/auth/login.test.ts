import {TestRequestSuiteDefinition} from 'declarative-e2e-test';
import {decode} from 'jsonwebtoken';
import {Response} from 'supertest';
import {hooks, routes} from '../../tests';

const url = routes.login;
export const loginTestDefinition: TestRequestSuiteDefinition = {
  'Login API': {
    beforeEach: hooks.resetDemoTestData,
    tests: {
      'Successful login': {
        tests: {
          'returns status 200 on login success': {
            url,
            verb: 'POST',
            body: {username: 'johnDoe', password: 'johnDoe-pwd'},
            expect: 200
          },
          'returns auth "token" in the body': {
            url,
            verb: 'POST',
            body: {username: 'johnDoe', password: 'johnDoe-pwd'},
            expect: (resp: Response) => {
              expect(resp.body.token).toBeDefined();

              const tokenData = decode(resp.body.token) as any;

              // expiry set to 7d in seconds
              expect(tokenData.exp - tokenData.iat).toEqual(7 * 24 * 60 * 60);
              expect(tokenData).toMatchObject({username: 'johnDoe', role: 'user'});
            }
          }
        }
      },
      'Failed login': {
        tests: {
          'returns 400 for empty credentials': {
            url,
            verb: 'POST',
            body: {username: '', password: ''},
            expect: 400
          },
          'returns 401 for invalid credentials': {
            url,
            verb: 'POST',
            body: {username: 'johnDoe', password: 'wrong password!'},
            expect: 401
          },
          'returns 401 for disabled accounts': {
            url,
            verb: 'POST',
            body: {username: 'janeDoe', password: 'janeDoe-pwd'},
            expect: 401
          },
          'locks account after 5 attempts': {
            steps: [
              {
                url,
                verb: 'POST',
                body: {username: 'johnDoe', password: 'johnDoe-pwd'},
                expect: 200
              },
              ...Array(5)
                .fill({
                  url,
                  verb: 'POST',
                  body: {username: 'johnDoe', password: 'wrong password!'},
                  expect: 401
                }),
              {
                url,
                verb: 'POST',
                body: {username: 'johnDoe', password: 'johnDoe-pwd'},
                expect: 401
              }
            ]
          }
        }
      }
    }
  }
};
