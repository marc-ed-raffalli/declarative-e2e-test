## declarative-e2e-test example

The test definitions are located in `*.test.ts`.
The purpose of the isolation is to demo the compatibility with several test frameworks.

[X] Jest - `*.jest.test.ts`
[ ] Mocha
[ ] Jasmine


### Disclaimer

The server application has for sole purpose to provide a support to demo the `declarative-e2e-test`.
While some of the parts are realistic on purpose, it is NOT recommended to follow the implementation in the server for production.

### Demonstrated scenario

The example demonstrates the use of the `declarative-e2e-test` lib with Jest.

The tests are written to work in conjunction with providing the app instance to the [supertest][supertest] agent.
The logic of the hooks would be different when testing against an IP or domain.

Two loggers are available:
    - App server logger, (set in `src/app.ts`).
      Change the logging level to `TRACE` to get more details of the actions performed by the app during the tests.
    - `declarative-e2e-test` logs, (set in `global-test-config.ts`)

#### `global-test-config.ts`

**Test cases:**

- tests `Content-Type` header
- tests some of the recommended headers set by the middleware [helmet](https://helmetjs.github.io/)

**Demonstrated features:**

- global expectations
- multiple values match for header
- custom response check
- app instance
- base url - *reference only as the app instance is used in this case*

#### `status.test.ts`

**Test cases:**

- the status payload contains the started date and the up time

**Demonstrated features:**

- simple status check
- custom response check

#### `login.test.ts`

**Test cases:**

- successful login + token verification
- failed login
  - wrong password
  - account disabled
  - wrong password + account lockout after 5 attempts

**Demonstrated features:**

- hooks
- simple status check
- custom response check
- steps

#### `logout.test.ts`

**Test cases:**

- logout + token invalidation
- logout + no token token provided

**Demonstrated features:**

- multiple hooks via array
- async hooks + setting test contextual data via `this`
- simple status check
- setting headers as a callback + access test contextual data
- steps

#### `profile.test.ts`

**Test cases:**

- the user can access his profile
- an user CANNOT access another user's profile
- anonymous / unauthenticated users cannot access user's profile
- admin CAN access another user's profile

**Demonstrated features:**

- nested test suites
- async hooks + setting test contextual data via `this`
- simple status check
- setting headers as a callback + access test contextual data

[supertest]: https://github.com/visionmedia/supertest/
