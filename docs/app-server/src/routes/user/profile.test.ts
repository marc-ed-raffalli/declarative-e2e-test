import {TestRequestSuiteDefinition} from 'declarative-e2e-test';
import {getAuthorizationHeaders, hooks, routes} from '../../tests';

const url = routes.profileData;
export const profileTestDefinition: TestRequestSuiteDefinition = {
  'Profile API': {
    beforeEach: [
      hooks.resetDemoTestData,
      hooks.setTokenForUser({username: 'johnDoe', password: 'johnDoe-pwd'})
    ],
    tests: {
      'returns user\'s data': {
        url,
        headers: getAuthorizationHeaders,
        verb: 'GET',
        expect: {username: 'johnDoe', role: 'user'}
      },
      'returns 401 when not authenticated': {
        url,
        verb: 'GET',
        expect: 401
      }
    }
  }
};
