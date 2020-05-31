import {ITestConfig} from './models';
import {TestRequestSuiteDefinition, TestRunner} from './test-runner';
import {Logger} from './utils/logger';

export {api, IApiMapper} from 'declarative-test-structure-generator';
export {ITestConfig} from './models';
export {TestRequestSuiteDefinition} from './test-runner';

export function run(testSuiteDefinition: TestRequestSuiteDefinition, config: ITestConfig) {
  Logger.setLogLevel(config.logLevel);
  TestRunner.buildTestRunner(testSuiteDefinition, config).run();
}
