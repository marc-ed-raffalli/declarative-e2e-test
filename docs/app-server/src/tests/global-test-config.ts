import {ITestConfig} from 'declarative-e2e-test';
import {Response} from 'supertest';
import {app} from '../app';

export const
  routes = {
    status: '/',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    profileData: '/api/user/profile',
    users: '/api/user/users',
    resetTestData: '/api/reset-test-data'
  };

export const config: Omit<ITestConfig, 'api'> = {
  // optional, set tested application
  // https://github.com/visionmedia/supertest/
  app,

  logLevel: 'SILENT',
  config: {
    // server base URL should be set here to avoid duplication across tests
    // url containing domain / port is NOT compatible with the usage of the app instance
    // url: 'http://127.0.0.1:3000',
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
