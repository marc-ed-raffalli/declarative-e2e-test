import {TestRequestSuiteDefinition} from 'declarative-e2e-test';
import {Response} from 'supertest';
import {routes} from '../tests';

const url = routes.status;
export const statusTestDefinition: TestRequestSuiteDefinition = {
  'Status API': {
    tests: {
      'returns status 200': {
        url,
        expect: 200
      },
      'returns "started" date and "up" time': {
        url,
        expect: (resp: Response) => {
          // check "started" is a valid date
          expect(new Date(resp.body.started).getTime()).not.toBeNaN();
          expect(typeof resp.body.up).toBe('number');
        }
      }
    }
  }
};
