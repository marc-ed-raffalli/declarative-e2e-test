import {ITestSuite} from 'declarative-test-structure-generator';
import {IWithName} from './shared';
import {TestBlockDefinition} from './test-block';

type arrayWithNameOrObject<T> = Array<T & IWithName> | { [k: string]: T };

export interface ITestRequestSuite extends Omit<ITestSuite, 'tests'> {
  tests: arrayWithNameOrObject<TestBlockDefinition | ITestRequestSuite>;
}
