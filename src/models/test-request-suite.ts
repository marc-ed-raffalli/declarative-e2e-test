import {ITestSuite} from 'declarative-test-structure-generator';
import {TestBlockDefinition} from './test-block';
import {IWithName} from './shared';

type arrayWithNameOrObject<T> = Array<T & IWithName> | { [k: string]: T };

export interface ITestRequestSuite extends Omit<ITestSuite, 'tests'> {
  tests: arrayWithNameOrObject<TestBlockDefinition | ITestRequestSuite>;
}
