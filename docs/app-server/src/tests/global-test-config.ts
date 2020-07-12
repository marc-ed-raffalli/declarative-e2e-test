import {ITestConfig} from 'declarative-e2e-test';
import {Response} from 'supertest';

const url = 'http://127.0.0.1:3000';

export const
  SERVER_URL = url,
  routes = {
    status: '/',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    profileData: '/api/user/profile',
    users: '/api/user/users',
    resetTestData: '/api/reset-test-data'
  };

export const config: Omit<ITestConfig, 'api'> = {
  logLevel: 'SILENT',
  config: {
    url,
    expect: [
      {
        headers: {
          'Content-Type': [
            /application\/json/,
            /charset=utf-8/
          ],
          'X-DNS-Prefetch-Control': 'off',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Download-Options': 'noopen',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block'
        }
      },
      (resp: Response) => {
        expect(resp.header['x-powered-by']).not.toBeDefined();
      }
    ]
  }
};
