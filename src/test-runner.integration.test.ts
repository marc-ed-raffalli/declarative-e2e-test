import {IApiMapper} from 'declarative-test-structure-generator';
import {ITestConfig} from './models';
import {TestRequestSuiteDefinition, TestRunner} from './test-runner';

describe('TestRunner - integration', () => {

  let
    apiMappingMock: IApiMapper,
    url: string,
    testConfig: ITestConfig,
    definition: TestRequestSuiteDefinition
  ;

  function runTests(def: TestRequestSuiteDefinition) {
    TestRunner.buildTestRunner(def, testConfig).run();
  }

  beforeEach(() => {
    const selfCallingCb = () => jest.fn().mockImplementation((arg1: any, arg2: any) => {
      if (typeof arg1 === 'function') {
        return arg1();
      }

      return arg2();
    });
    apiMappingMock = {
      before: selfCallingCb(),
      beforeEach: selfCallingCb(),
      after: selfCallingCb(),
      afterEach: selfCallingCb(),
      describe: selfCallingCb(),
      it: selfCallingCb(),
    } as unknown as IApiMapper; // partial mock

    // @ts-ignore
    testConfig = {api: apiMappingMock} as ITestConfig;
    url = 'https://mock-url.ie';
  });

  describe('hooks', () => {

    it('sets context across full test suite', () => {
      let foo = 'foo', bar = 'bar',
        checkCount = 0;

      function checkContextFooBar(this: any) {
        expect(this).toEqual({foo, bar});
        checkCount++;
      }

      definition = {
        'Level 1': {
          before: function (this: any) {
            expect(this).toEqual({});
            this.foo = 'foo';
            checkCount++;
          },
          beforeEach: function (this: any) {
            expect(this).toEqual({foo});
            this.bar = 'bar';
            checkCount++;
          },
          after: checkContextFooBar,
          afterEach: checkContextFooBar,
          tests: {
            'Level 1.1': {
              before() {
                checkContextFooBar.call(this);
              },
              beforeEach() {
                checkContextFooBar.call(this);
              },
              after() {
                checkContextFooBar.call(this);
              },
              afterEach() {
                checkContextFooBar.call(this);
              },
              tests: {
                'test 1.1': {
                  url() {
                    expect(this).toEqual({foo, bar});
                    return url;
                  },
                  expect: 200
                }
              }
            }
          }
        }
      };

      runTests(definition);

      expect(apiMappingMock.before).toHaveBeenCalledTimes(2);
      expect(apiMappingMock.beforeEach).toHaveBeenCalledTimes(2);
      expect(apiMappingMock.after).toHaveBeenCalledTimes(2);
      expect(apiMappingMock.afterEach).toHaveBeenCalledTimes(2);
      expect(checkCount).toEqual(8);
    });

    it('sets context in callbacks', async () => {
      let checkCount = 0;

      const
        foo = 'foo',
        getContextCallbackWithReturnedValue = (value: any) => function (this: any) {
          expect(this).toEqual({foo});
          checkCount++;
          return value;
        };

      definition = {
        'Level 1': {
          before(this: any) {
            this.foo = 'foo';
            checkCount++;
          },
          tests: {
            'normal test': {
              url: getContextCallbackWithReturnedValue(url),
              headers: getContextCallbackWithReturnedValue({}),
              body: getContextCallbackWithReturnedValue({}),
              expect: getContextCallbackWithReturnedValue(undefined)
            },
            'test with steps': {
              steps: [
                {
                  url: getContextCallbackWithReturnedValue(url),
                  headers: getContextCallbackWithReturnedValue({}),
                  body: getContextCallbackWithReturnedValue({}),
                  expect: getContextCallbackWithReturnedValue(undefined)
                }
              ]
            }
          }
        }
      };

      runTests(definition);

      // steps resolve asynchronously
      // need to delay the expect until the stack is processed
      await Promise.resolve();

      expect(checkCount).toEqual(9);
    });

  });

});
