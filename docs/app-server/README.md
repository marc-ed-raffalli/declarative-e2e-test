## declarative-e2e-test example

The test definitions are located in `*.test.ts`.
The purpose of the isolation is to demo the compatibility with several test frameworks.

[X] Jest
[ ] Mocha
[ ] Jasmine

### Disclaimer

The server application has for sole purpose to provide a support to demo the `declarative-e2e-test`.
It is NOT recommended to follow the implementation in the server for production.

### Demonstrated scenario

The example demonstrates the use of the `declarative-e2e-test` lib with Jest.

#### `global-test-config.ts`

**Test cases:**

- tests `Content-Type` header
- tests some of the recommended headers are set on the response

**Demonstrated features:**

- global expectations
- multiple values match for header
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

- access to protected route is blocked for unauthorized users
- access to protected route is granted for user

**Demonstrated features:**

- multiple hooks via array
- async hooks + setting test contextual data via `this`
- simple status check
- setting headers as a callback + access test contextual data

