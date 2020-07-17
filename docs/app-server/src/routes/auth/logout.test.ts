import {TestRequestSuiteDefinition} from 'declarative-e2e-test';
import {getAuthorizationHeaders, hooks, routes} from '../../tests';

const
  url = routes.logout,
  johnDoeProfileUrl = `${routes.profileData}/johnDoe`;

export const logoutTestDefinition: TestRequestSuiteDefinition = {
  'Logout API': {
    beforeEach: [
      hooks.resetDemoTestData(),
      hooks.setTokenForUser({username: 'johnDoe', password: 'johnDoe-pwd'})
    ],
    tests: {
      'returns status 200 on logout': {
        url,
        headers: getAuthorizationHeaders,
        verb: 'DELETE',
        expect: 200
      },
      'returns status 401 without token provided': {
        url,
        verb: 'DELETE',
        expect: 401
      },
      'correctly invalidates the token': {
        steps: [
          {
            url: johnDoeProfileUrl,
            verb: 'GET',
            headers: getAuthorizationHeaders,
            expect: 200
          },
          {
            url,
            verb: 'DELETE',
            headers: getAuthorizationHeaders,
            expect: 200
          },
          {
            url: johnDoeProfileUrl,
            verb: 'GET',
            headers: getAuthorizationHeaders,
            expect: 401
          }
        ]
      }
    }
  }
};
