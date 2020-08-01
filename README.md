# declarative-e2e-test

Easy to write, easy to maintain, clutter free :)

[![Build Status](https://travis-ci.org/marc-ed-raffalli/declarative-e2e-test.svg?branch=master)](https://travis-ci.org/marc-ed-raffalli/declarative-e2e-test)
[![Coverage Status](https://coveralls.io/repos/github/marc-ed-raffalli/declarative-e2e-test/badge.svg?branch=master)](https://coveralls.io/github/marc-ed-raffalli/declarative-e2e-test?branch=master)
[![NPM version](https://img.shields.io/npm/v/declarative-e2e-test.svg)](https://www.npmjs.com/package/declarative-e2e-test)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/marc-ed-raffalli/declarative-e2e-test/blob/master/LICENSE)

`declarative-e2e-test` is a Node.js library designed to write e2e tests for any backends in a declarative way.

```typescript
import {api, run, TestRequestSuiteDefinition} from 'declarative-e2e-test';

const exampleTestDefinition: TestRequestSuiteDefinition = {
  'Profile API': {
    tests: {
      'returns user data': {
        url: '/user/profile',
        headers: {authorization: 'some-auth-token'},
        expect: {username: 'johnDoe', role: 'user'}
      },
      'returns 401 when not authenticated': {
        url: '/user/profile',
        expect: 401
      }
    }
  }
};

run(exampleTestDefinition, {api: api.jest});
```

## Features

- Makes HTTP request from node.js and assert response
- Compatible with major Node testing libraries
- Generates the tests and test suites where the requests are performed
- Flexible response assertion
    - status
    - headers / payload
    - multiple / default
- Test hooks / Skip / Only
- Single request flow / series of requests
- Easy integration with Express application instance

## Installation

**Using Yarn**:
```bash
$ yarn add --save-dev declarative-e2e-test

# or
$ yarn add -D declarative-e2e-test
```

**Using Npm**:
```bash
$ npm install --save-dev declarative-e2e-test

# or
$ npm i -D declarative-e2e-test
```

`declarative-e2e-test` does not include any testing libraries.
A testing library of the like of [Jest][jest], [Jasmine][jasmine] or [Mocha][mocha] is required to run the tests.

## Documentation

[View project's homepage][projectHomePage]

## Issues

Please share your feedback and report the encountered issues on the
[project's issues page][projectIssues].



[projectHomePage]: https://marc-ed-raffalli.github.io/declarative-e2e-test
[projectIssues]: https://github.com/marc-ed-raffalli/declarative-e2e-test/issues

[jest]: https://jestjs.io/
[jasmine]: https://jasmine.github.io/
[mocha]: https://mochajs.org/
