import {TestRequestSuiteDefinition} from 'declarative-e2e-test';
import {getAuthorizationHeaders, hooks, routes} from '../../tests';

const johnDoeProfileUrl = `${routes.profileData}/johnDoe`;
export const profileTestDefinition: TestRequestSuiteDefinition = {
  'Profile API': {
    beforeEach: hooks.resetDemoTestData(),
    tests: {
      'user access': {
        beforeEach: hooks.setTokenForUser({username: 'johnDoe', password: 'johnDoe-pwd'}),
        tests: {
          'returns user\'s profile - owner': {
            url: johnDoeProfileUrl,
            headers: getAuthorizationHeaders,
            verb: 'GET',
            expect: {username: 'johnDoe', role: 'user'}
          },
          'returns 403 when not owner': {
            url: `${routes.profileData}/janeDoe`,
            headers: getAuthorizationHeaders,
            verb: 'GET',
            expect: 403
          },
          'returns 401 when not authenticated': {
            url: johnDoeProfileUrl,
            verb: 'GET',
            expect: 401
          }
        }
      },
      'admin access': {
        beforeEach: hooks.setTokenForUser({username: 'theAdmin', password: 'theAdmin-pwd'}),
        tests: {
          'returns user\'s profile - admin': {
            url: johnDoeProfileUrl,
            headers: getAuthorizationHeaders,
            verb: 'GET',
            expect: {username: 'johnDoe', role: 'user'}
          }
        }
      }
    }
  }
};
