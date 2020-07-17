import {IApiMapper, ITestSuite, run, TestSuiteDefinition} from 'declarative-test-structure-generator';
import {ITestConfig, ITestRequestConfig, ITestRequestSuite, IWithName} from './models';
import {TestBlock} from './test-block';
import {Logger} from './utils/logger';

export type TestRequestSuiteDefinition = Array<ITestRequestSuite & IWithName> | { [k: string]: ITestRequestSuite };

const logger = Logger.getLogger();

export class TestRunner {

  constructor(private readonly testDefinition: TestSuiteDefinition, private readonly api: IApiMapper) {
  }

  static buildTestRunner(
    testRequestSuiteDefinition: TestRequestSuiteDefinition,
    {api, config, logLevel, app}: ITestConfig
  ) {
    Logger.setLogLevel(logLevel);
    logger.trace('Mapping the test request definitions to target definition');
    const testDefinition = reduceList(
      testRequestSuiteDefinition,
      (def) => convertToTestSuiteDefinition(def, config, app)
    );
    logger.trace('Mapping - complete');

    return new TestRunner(testDefinition, api);
  }

  run() {
    logger.debug('Running test definition');
    run(this.testDefinition, {api: this.api});
  }

}

/**
 * Recursively converts ITestRequestSuite to ITestSuite format.
 * @param def
 * @param config
 * @param app
 */
function convertToTestSuiteDefinition(
  def: ITestRequestSuite & IWithName,
  config: ITestRequestConfig = {},
  app?: any
): ITestSuite {
  return {
    ...def,
    tests: reduceList(def.tests, (d) =>
      'tests' in d
        ? convertToTestSuiteDefinition(d, config, app)
        : new TestBlock(d, config, app).generate()
    )
  };
}

/**
 * Maps or reduces the object or array provided to the matching array or object
 * with values returned from the callback.
 * @param itemList
 * @param cb
 */
function reduceList<T extends object>(itemList: Array<T & IWithName> | { [k: string]: T }, cb: (d: T & IWithName) => any) {
  return Array.isArray(itemList)
    ? itemList.map(cb)
    : Object.entries(itemList)
      .reduce((acc, [key, def]) => ({
        ...acc,
        [key]: cb({...def, name: key})
      }), {});
}
