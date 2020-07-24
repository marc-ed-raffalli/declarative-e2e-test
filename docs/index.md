---
sidemenu: true
---

# declarative-e2e-test

{% include lead.html message='Easy to write, easy to maintain, clutter free :)' %}

[![Build Status](https://travis-ci.org/marc-ed-raffalli/declarative-e2e-test.svg?branch=master)](https://travis-ci.org/marc-ed-raffalli/declarative-e2e-test)
[![Coverage Status](https://coveralls.io/repos/github/marc-ed-raffalli/declarative-e2e-test/badge.svg?branch=master)](https://coveralls.io/github/marc-ed-raffalli/declarative-e2e-test?branch=master)
[![NPM version](https://img.shields.io/npm/v/declarative-e2e-test.svg)](https://www.npmjs.com/package/declarative-e2e-test)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/marc-ed-raffalli/declarative-e2e-test/blob/master/LICENSE)

`declarative-e2e-test` allows to write tests for any backend in an object definition style.

```typescript
import {api, run, TestRequestSuiteDefinition} from 'declarative-e2e-test';

const exampleTestDefinition: TestRequestSuiteDefinition = {
  'returns user data': {
    url: '/user/profile',
    headers: {authorization: 'some-auth-token'},
    expect: {username: 'johnDoe', role: 'user'}
  },
  'returns 401 when not authenticated': {
    url: '/user/profile',
    expect: 401
  }
};

run(exampleTestDefinition, {api: api.jest});
```

## TLDR;

This section is written for people who prefer to try out things quickly.

The next section ([Getting Started](#getting-started)) gives a fully detailed overview, as well as examples.

### Installation

```bash
$ yarn add -D declarative-e2e-test
```

### Writing test

The example below cover some of the basics:
- Definition syntax
- Custom expect function (to be implemented with the test library of your choice)

```typescript
import {api, run, TestRequestSuiteDefinition} from 'declarative-e2e-test';

const exampleTestDefinition: TestRequestSuiteDefinition = {
  'Status API': {
    tests: {
      'returns status 200': {
        url: SERVER_URL,
        expect: 200
      },
      'returns "started" date and "up" time': {
        url: SERVER_URL,
        expect: (resp: Response) => {
          // check "started" is a valid date
          expect(new Date(resp.body.started).getTime()).not.toBeNaN();
          expect(typeof resp.body.up).toBe('number');
        }
      }
    }
  },
  'Profile API': {
    tests: {
      'returns user\'s data': {
        url: `${SERVER_URL}/user/profile`,
        headers: () => {authorization: someAuthToken},
        expect: {username: 'johnDoe', role: 'user'}
      },
      'returns 401 when not authenticated': {
        url: `${SERVER_URL}/user/profile`,
        expect: 401
      }
    }
  },
  'Login API': {
    tests: {
      'returns status 200 on login success': {
        url: `${SERVER_URL}/auth/login`,
        verb: 'POST',
        body: {username: 'johnDoe', password: 'johnDoe-pwd'},
        expect: 200
      },
      'returns JWT auth "token" in the body': {
        url: `${SERVER_URL}/auth/login`,
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
  }
};

run(exampleTestDefinition, {api: api.jest});
```

## Getting Started

Why `declarative-e2e-test`?

- It allows to **focus on what matters**: request => response
- It helps to write **readable** and **maintainable** e2e tests
- It is **flexible**: compatible with any popular Node test frameworks

The library is written in TypeScript with a very well defined API, each feature is illustrated below with code examples.

Note: most of the examples are using the Jest API but the Mocha or Jasmine API can be used as well.
(see [Linking the test library][linkingLibrary])

{% include alert.html type='warning' message='
Differences in the API will apply when implementing custom assertions.
e.g. `expect(foo).to.equal(123);` vs. `expect(foo).toEqual(123);`' %}

A special thanks for the developers of the [Supertest][supertest] library.
[Supertest][supertest] is used under the hood to send the requests and perform the assertions.

### Installation

[![NPM version](https://img.shields.io/npm/v/declarative-e2e-test.svg)](https://www.npmjs.com/package/declarative-e2e-test)

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

### Linking the test library

No test library are bundled in order to ease the update and offer more flexibility.
In order to facilitate the usage, the mapping for `jasmine`, `jest` and `mocha` is provided.
See the [Global Config => API](#api) section.

### Basic Setup

The test definition supports two syntaxes.
The example below is written in the [object style](#object-style).

```typescript
import {api, run, TestRequestSuiteDefinition} from 'declarative-e2e-test';

const basicSetup: TestRequestSuiteDefinition = {
  'Basic Setup example': {
    tests: {
      'returns status 200': {
        url: SERVER_URL,
        expect: 200
      }
    }
  }
};

run(exampleTestDefinition, {api: api.jest});
```

The code snippet above completes the following:
- Creates a test suite `'Status API'`
- Creates a test `'returns status 200'`
- Sends a request to the url: `SERVER_URL`
- Verifies the response received has status `200`

### Using with a Node server

[Supertest][supertest] supports passing an `http.Server`, or a `Function` to `request()`.
This API is also available with `declarative-e2e-test`.

In the example below, an Express application is created and the `app` instance is passed in the `run` options.

**app.ts**
```typescript
const express = require('express');

export const app = express();
// ...
```

**app.test.ts**
```typescript
import {api, run} from 'declarative-e2e-test';
import {app} from '../app';

run(appTestDefinition, {api: api.jest, app});
```

As the app is passed as a reference, [Supertest][supertest] will automatically start the app if no instance is started.
It avoids having to start the server separately and allows to share the same execution context as the tests.
Without passing the `app` instance, the server needs to be treated as a complete black box.

## Test Definition

`declarative-e2e-test` is leveraging
[`declarative-test-structure-generator`][dtsg] to generate the tests and test suites from the definition.
See [project's page][dtsg].

### Syntax

The provided `definition` (top-level) can either be an object or an array.
The `name` property is required when using the array syntax.

#### Object Style

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const objectStyle: TestRequestSuiteDefinition = {
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
```

#### Array Style

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const arrayStyle: TestRequestSuiteDefinition = [
  {
    name: 'Status API',
    tests: [
      {
        name: 'returns status 200',
        url,
        expect: 200
      },
      {
        name: 'returns "started" date and "up" time',
        url,
        expect: (resp: Response) => {
          // check "started" is a valid date
          expect(new Date(resp.body.started).getTime()).not.toBeNaN();
          expect(typeof resp.body.up).toBe('number');
        }
      }
    ]
  }
];
```

#### Test Hierarchy

Test suites can be grouped and structured hierarchically.
There is no limitation on the depth for both syntaxes.

**Object Syntax:**
```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const nestedTestSuitesObjectStyle: TestRequestSuiteDefinition = {
  'Group 1': {
    tests: {
      'Group 1.1': {
        tests: {
          'test 1.1': {...},
          'test 1.2': {...}
        }
      }
    }
  },
  'Group 2': {
    tests: {
      'test 2.1': {...},
      'test 2.2': {...}
    }
  }
};
```

**Array Syntax:**
```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const nestedTestSuitesArrayStyle: TestRequestSuiteDefinition = [
  {
    name: 'Group 1',
    tests: [
      {
        name: 'Group 1.1',
        tests: [
          {name: 'test 1.1', ...}
        ]
      }
    ]
  }
];
```

#### Mixed Style

It is possible to mix and match the syntax at any level of the structure.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const nestedTestDefinition: TestRequestSuiteDefinition = {
  'Group 1': { // object style
    tests: [   // array style
      {
        name: 'Group 1.1',
        tests: {    // object style
          'test 1.1': {...}
        }
      },
      {
        name: 'Group 1.2',
        tests: [    // array style
          {name: 'test 1.2', ...}
        ]
      },
    ]
  }
};
```

### Skip / Only

The properties `skip` and `only` can be applied to either a test or a test suite.
They allow to either skip or only run a particular test.

It is a time saver when focusing on a test or feature.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const statusTestDefinition: TestRequestSuiteDefinition = {
  'Status API': {
    // only: true, // run only the test suite
    // skip: true, // skip the test suite
    tests: {
      'returns status 200': {
        only: true,     // run only the test
        // skip: true,  // skip the test
        url,
        expect: 200
      }
    }
  }
};
```

### Test Hooks

It is possible to run one or many functions at different phase of the test.

This section is tightly related to the next ones: [Lazy Evaluation][lazyEvaluation] and [Test and Callback Context][testContext].

Hooks are a convenient way to set the test data and clear it once the test is done.
Test data can be either assigned on a local variable or via the **test context**, accessible in each hook and each callback,
[read more][testContext].

The hook definition is as follow:
- `before`: is called once, **before all** tests.
- `beforeEach`: is called **before each** test.
- `after`: is called once, **after all** tests.
- `afterEach`: is called **after each** test.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const testHooksExample: TestRequestSuiteDefinition = {
  'Test hooks example': {
    before(this: any) {
      // store data in the context for later use
      this.someValue = 'Bill';
    },
    beforeEach: [
      () => {
        // do something
      },
      (done) => {
        // do something async
        done();
      },
      () => {
        // do something async
        return somePromise;
      }
    ],
    after: () => {
    },
    afterEach: () => {
    },
    tests: {
      'example with value from the context': {
        url(this: any) {
          return `${SERVER_URL}/${this.someValue}`;
        },
        expect: 200
      }
    }
  }
};
```

As illustrated with the `beforeEach`, multiple hooks of the same type are supported using an `array`.
Each hook is called in the specified order.

Additionally, async hooks are supported via:
- done callback
- return of a Promise


### Lazy Evaluation

Values that are initialized in any of the hooks should be returned via a callback in the test definition.

All properties of the test definition (except `verb` and `expect`) support returning the value at runtime via a callback.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

let someLocalValue: string;

const lazyEvaluationExample: TestRequestSuiteDefinition = {
  'Lazy evaluation example': {
    before: function (this: any) {
      this.someContextValue = 'Foo';
    },
    beforeEach: () => {
      someLocalValue = 'Bar';
    },
    tests: {
      'example with value returned via callback using context': {
        url: function (this: any) {
          return `${SERVER_URL}/${this.someContextValue}`;
        },
        expect: 200
      },
      'example with local value returned via callback using context': {
        url: () => `${SERVER_URL}/${someLocalValue}`,
        expect: 200
      }
    }
  }
};
```


### Test and Callback Context

Test libraries like [Mocha][mocha] have the concept of context (see [docs](https://mochajs.org/#available-root-hooks)).
The test context allows to store values e.g. during hooks, and retrieve them in the test.

Regardless of the API selected, a test context is created and available to share data between hooks and test callbacks.
The concept is applied to all properties supporting returning a value via callback, see [Lazy Evaluation][lazyEvaluation].
The two available notations are illustrated in the example below,

{% include alert.html type='warning' message='
The context is NOT available when using arrow functions.
Arrow functions lexically bind `this` and prevent from accessing the test context.'
%}

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const contextExample: TestRequestSuiteDefinition = {
  'Context example': {
    // note the two available notations:
    before(this: any) {
      this.foo = 'Foo';
    },
    beforeEach: function (this: any) {
      this.bar = 'Bar';
    },
    tests: {
      'Nested test suite': {
        beforeEach(this: any) {
          this.baz = 'Baz';
        },
        tests: {
          'example with callbacks using context': {
            // in all the callbacks below,
            // "this" holds the values set in the hooks
            url(this: any) {
              return `${SERVER_URL}/${this.foo}`;
            },
            headers(this: any) {
              return {headerValue: this.bar};
            },
            body: function (this: any) {
              return {
                bodyValue1: this.foo,
                bodyValue2: this.bar
              };
            },
            expect: function (this: any, response: Response) {
              expect(response.body.someValue).toEqual(this.foo);
            }
          }
        }
      }
    }
  }
};
```


### Request

#### Set HTTP Verb

The following HTTP verbs are supported:

- `HEAD`
- `GET` - *(default)*
- `POST`
- `PUT`
- `PATCH`
- `DELETE`

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const requestVerb: TestRequestSuiteDefinition = {
  'Request Verb example': {
    tests: {
      'example with verb': {
        verb: 'HEAD',
        url,
        expect: 200
      }
    }
  }
};
```

#### Set HTTP Headers

The request headers can be set as an object, or as a callback returning an object.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

interface IWithAuthToken {
  token: string;
}

const settingRequestHeadersExample: TestRequestSuiteDefinition = {
  'Setting Request Headers example': {
    beforeEach: async function (this: IWithAuthToken) {
      // set the token in the context
      this.token = await getUserToken({username: 'johnDoe', password: 'johnDoe-pwd'});
    },
    tests: {
      'header example - object': {
        url,
        headers: {authorization: 'someSecretTokenOrApiKey'},
        expect: 200
      },
      'header example - async': {
        url,
        headers(this: IWithAuthToken) {
          // retrieve the token from the context
          return {authorization: this.token};
        },
        expect: 200
      }
    }
  }
};
```

#### Set Body

The request body can be set as a value, or as a callback returning a value.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const settingRequestBodyExample: TestRequestSuiteDefinition = {
  'Setting Request Body example': {
    async beforeEach(this: any) {
      this.userId = await getUserId();
    },
    tests: {
      'body example - object': {
        url,
        verb: 'POST',
        body: {username: 'johnDoe', password: 'johnDoe-pwd', name: 'John Doe'},
        expect: 201
      },
      'body example - async': {
        url,
        verb: 'PUT',
        body(this: any) {
          return {
            userId: this.userId,
            name: 'John & Jane Doe'
          };
        },
        expect: 200
      }
    }
  }
};
```

#### Steps

The proper way to verify some requests resides on the result of a subsequent request, not on the response.
E.g. login and token verification, logout and token invalidation, etc

The `steps` property allows to define a series of requests/tests to perform as a test.
Each step defines a request, it is possible to get the response of the previous request via callback (see example below).

```typescript
import {TestRequestSuiteDefinition, Response} from 'declarative-e2e-test';

const settingStepsExample: TestRequestSuiteDefinition = {
  'Auth API': {
    tests: {
      'correctly invalidates the token': {
        steps: [
          {
            url: `${SERVER_URL}/user/profile`,
            verb: 'GET',
            headers: getAuthorizationHeaders,
            expect: 200
          },
          {
            url: `${SERVER_URL}/auth/access`,
            verb: 'DELETE',
            headers: getAuthorizationHeaders,
            expect: 200
          },
          {
            url: `${SERVER_URL}/user/profile`,
            verb: 'GET',
            headers: getAuthorizationHeaders,
            expect: 401
          }
        ]
      },
      'auth returns a valid token': {
        steps: [
          {
            url: `${SERVER_URL}/user/access`,
            verb: 'POST',
            expect: 201
          },
          (resp: Response) => ({
            url: `${SERVER_URL}/user/profile`,
            headers: {authorization: resp.body.token},
            expect: 200
          })
        ]
      }
    }
  }
};
```

### Verify the Response

The verification of the response is achieved via the `expect` property.

As a wrapper for [Supertest][supertest], most of the API for the original `expect` is supported / wrapped.

It is possible to define a default series of verifications to perform on all the responses,
see [global config](#global-expect)


#### Status

Assert response `status` code (number only).

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const verifyResponseStatus: TestRequestSuiteDefinition = {
  'Verify Response Status example': {
    tests: {
      'returns status 200': {
        url: SERVER_URL,
        expect: 200
      }
    }
  }
};
```

#### Headers

The assertion for headers supports few different types: `string`, `array` or `RegExp`.

See example below, the `Content-Type` header is checked for the presence of `application/json` and `charset=utf-8`.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const headersAssertion: TestRequestSuiteDefinition = {
  'Headers assertion example': {
    tests: {
      'returns response with XYZ headers': {
        url: SERVER_URL,
        expect: {
          headers: {
            'Content-Type': [
              /application\/json/,
              /charset=utf-8/
            ],
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block'
          }
        }
      }
    }
  }
};
```

#### Body

The assertion for response payload is as as described in the
[Supertest docs](https://github.com/visionmedia/supertest/#expectbody-fn).

Below is an example (strictly) checking the payload of the response.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const bodyAssertion: TestRequestSuiteDefinition = {
  'Body assertion example': {
    tests: {
      'returns response with user info': {
        url: SERVER_URL,
        expect: {username: 'johnDoe', role: 'user'}
      }
    }
  }
};
```

#### Headers and Body

The assertions for the headers and the body can be written together using the structure
`{header: expectedHeaderValue, body: expectedBodyValue}`:

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const bodyAndHeaderAssertion: TestRequestSuiteDefinition = {
  'Body and Header assertion example': {
    tests: {
      'returns response with XYZ headers and user info': {
        url: SERVER_URL,
        expect: {
          headers: {'xyz': 'some value'},
          body: {username: 'johnDoe', role: 'user'}
        }
      }
    }
  }
};
```

#### Multiple Assertions

It is possible to combine multiple assertions in a single statement using an `array`.

```typescript
import {TestRequestSuiteDefinition} from 'declarative-e2e-test';

const multipleAssertion: TestRequestSuiteDefinition = {
  'Multiple assertion example': {
    tests: {
      'returns status 200 and header "foo"': {
        url: SERVER_URL,
        expect: [200, {headers: {foo: 'foo header'}}]
      }
    }
  }
};
```

#### Error callback

When the test fails, an error is thrown.
The `error` property is mapped to the supertest `catch`, it is called with the error and the received response.

```typescript
import {TestRequestSuiteDefinition, Response} from 'declarative-e2e-test';

const errorCallback: TestRequestSuiteDefinition = {
  'Error Callback example': {
    tests: {
      'returns status 200': {
        url: SERVER_URL,
        expect: 200,
        error: (error: any, response: Response) => {
          // called when the test fails
        }
      }
    }
  }
};
```

## Global configuration

The global config is passed as the second argument to the `run` function.
It allows to configure the test library API, log level and common definition for the tests.

### API

As mentioned above, no test library are bundled in order to ease the update and offer more flexibility.
The structure definition syntax stays exactly the same between frameworks.

In order to facilitate the usage, the mapping for `jasmine`, `jest` and `mocha` is provided.

#### Jest

```typescript
import {api, run} from 'declarative-e2e-test';

run(testDefinition, {api: api.jest});
```

#### Jasmine

```typescript
import {api, run} from 'declarative-e2e-test';

run(testDefinition, {api: api.jasmine});
```

#### Mocha

```typescript
import {api, run} from 'declarative-e2e-test';

run(testDefinition, {api: api.jasmine});
```

#### Custom

It is possible to support a custom test library by providing a custom mapper (interface: `IApiMapper`).

```typescript
import {IApiMapper} from 'declarative-e2e-test';

export function getTestApiMapper(): IApiMapper {
  return {
    describe,
    it,
    before: beforeAll,
    beforeEach,
    after: afterAll,
    afterEach,
    only: {
      describe: describe.only,
      it: it.only
    },
    skip: {
      describe: describe.skip,
      it: it.skip
    }
  };
}
```

### Common test definition

#### URL

It is possible to target different domains by simply updating the `url` configuration.
When provided, the URL in the test definition will be appended to it.

```typescript
import {run} from 'declarative-e2e-test';

run(testDefinition, {config: {url: 'http://127.0.0.1:3000'}, ...});
```

#### Global `expect`

The global config allows to define a default series of tests to run on top of each test definition.
It is useful when asserting a common trait to all responses, e.g. security header.

The example below checks the presence of the headers set by the middleware [helmet](https://helmetjs.github.io/):

```typescript
import {api, ITestConfig, Response, run} from 'declarative-e2e-test';

const config: ITestConfig = {
  api: api.jest,
  config: {
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

run(testDefinition, config);
```

### Log level

The log level is set via the config `logLevel`.
There are 4 levels available: `TRACE`, `DEBUG`, `ERROR` and `SILENT`.

```typescript
import {run} from 'declarative-e2e-test';

run(testDefinition, {logLevel: 'TRACE', ...});
```

## Issues

Please share your feedback and report the encountered issues on the [project's issues page][projectIssues].

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/marc-ed-raffalli/declarative-e2e-test/blob/master/LICENSE)

MIT License

Copyright (c) 2020 [Marc-Ed Raffalli](https://marc-ed-raffalli.github.io/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[linkingLibrary]: #linking-the-test-library
[lazyEvaluation]: #lazy-evaluation
[testContext]: #test-and-callback-context

[dtsg]: /en/projects/declarative-test-structure-generator
[projectIssues]: https://github.com/marc-ed-raffalli/declarative-e2e-test/issues

[jest]: https://jestjs.io/
[jasmine]: https://jasmine.github.io/
[mocha]: https://mochajs.org/

[supertest]: https://github.com/visionmedia/supertest/

[superagent]: https://visionmedia.github.io/superagent/
