import {ITestConfig} from './models';
import {TestRequestSuiteDefinition, TestRunner} from './test-runner';

export {Response} from 'supertest';
export {api, IApiMapper} from 'declarative-test-structure-generator';
export {ITestConfig} from './models';
export {TestRequestSuiteDefinition} from './test-runner';

export function run(testSuiteDefinition: TestRequestSuiteDefinition, config: ITestConfig) {
  TestRunner.buildTestRunner(testSuiteDefinition, config).run();
}
