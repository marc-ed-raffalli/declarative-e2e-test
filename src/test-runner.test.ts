import {IApiMapper, run} from 'declarative-test-structure-generator';
import {ITestConfig, IWithName, TestBlockDefinition} from './models';
import {TestBlock} from './test-block';
import {TestRequestSuiteDefinition, TestRunner} from './test-runner';

jest.mock('declarative-test-structure-generator');
jest.mock('./test-block', () => ({
  TestBlock: jest.fn()
    .mockImplementation((def: TestBlockDefinition & IWithName) => ({
      generate: () => ({name: def.name})
    }))
}));

describe('TestRunner', () => {

  let
    testRunner: TestRunner,
    url: string,
    api: IApiMapper,
    testConfig: ITestConfig,
    definition: TestRequestSuiteDefinition
  ;

  beforeEach(() => {
    (TestBlock as jest.Mock).mockClear();
    (run as jest.Mock).mockClear();

    // mock for simplicity
    api = {it: jest.fn() as any} as IApiMapper;
    // @ts-ignore
    testConfig = {api, config: {url: 'foo'}} as ITestConfig;
    url = 'https://mock-url.ie';
  });

  describe('initialization', () => {

    it('converts from array', () => {
      definition = [
        {
          name: 'Foo suite',
          tests: [{name: 'Foo test 1', url, expect: 200}]
        },
        {
          name: 'Bar suite',
          tests: [{
            name: 'Nested suite',
            tests: [{name: 'Bar test 1', url, expect: 200}]
          }]
        }
      ];
      TestRunner.buildTestRunner(definition, testConfig);

      expect(TestBlock).toHaveBeenCalledWith({name: 'Foo test 1', url, expect: 200}, testConfig.config);
      expect(TestBlock).toHaveBeenCalledWith({name: 'Bar test 1', url, expect: 200}, testConfig.config);
    });

    it('converts from object', () => {
      definition = {
        'Foo suite': {
          tests: {
            'Foo test 1': {url, expect: 200}
          }
        },
        'Bar suite': {
          tests: {
            'Nested suite': {
              tests: {
                'Bar test 1': {url, expect: 200}
              }
            }
          }
        }
      };
      TestRunner.buildTestRunner(definition, testConfig);

      expect(TestBlock).toHaveBeenCalledWith({name: 'Foo test 1', url, expect: 200}, testConfig.config);
      expect(TestBlock).toHaveBeenCalledWith({name: 'Bar test 1', url, expect: 200}, testConfig.config);
    });

  });

  describe('run', () => {

    it('runs from array', () => {
      definition = [
        {
          name: 'Foo suite',
          tests: [{name: 'Foo test 1', url, expect: 200}]
        },
        {
          name: 'Bar suite',
          tests: [{
            name: 'Nested suite',
            tests: [{name: 'Bar test 1', url, expect: 200}]
          }]
        }
      ];
      testRunner = TestRunner.buildTestRunner(definition, testConfig);

      expect(run).not.toHaveBeenCalled();

      testRunner.run();

      expect(run).toHaveBeenCalledWith([
        {
          name: 'Foo suite',
          tests: [{name: 'Foo test 1'}]
        },
        {
          name: 'Bar suite',
          tests: [{
            name: 'Nested suite',
            tests: [{name: 'Bar test 1'}]
          }]
        }
      ], {api: testConfig.api});
    });

    it('runs from object', () => {
      definition = {
        'Foo suite': {
          tests: {
            'Foo test 1': {url, expect: 200}
          }
        },
        'Bar suite': {
          tests: {
            'Nested suite': {
              tests: {
                'Bar test 1': {url, expect: 200}
              }
            }
          }
        }
      };
      testRunner = TestRunner.buildTestRunner(definition, testConfig);

      expect(run).not.toHaveBeenCalled();

      testRunner.run();

      expect(run).toHaveBeenCalledWith({
        'Foo suite': {
          name: 'Foo suite',
          tests: {
            'Foo test 1': expect.any(Object)
          }
        },
        'Bar suite': {
          name: 'Bar suite',
          tests: {
            'Nested suite': {
              name: 'Nested suite',
              tests: {
                'Bar test 1': expect.any(Object)
              }
            }
          }
        }
      }, {api: testConfig.api});
    });

  });

});
