import {ITest} from 'declarative-test-structure-generator';
import {Response} from 'supertest';
import {ITestedRequest} from './request';

// tslint:disable-next-line:no-empty-interface
interface ITestBlock extends Omit<ITest, 'test'>, ITestedRequest {
}

/**
 * The properties in the definition are used in each step if no values are defined.
 * Url and expect should be defined in the steps
 */
interface ITestBlockWithSteps extends Omit<ITestBlock, 'url' | 'expect'> {
  steps: TestStepType[];
}

// tslint:disable-next-line:no-empty-interface
export interface ITestStep extends ITestedRequest {
}

export type TestStepType = ITestStep | ((resp: Response) => ITestStep);
export type TestBlockDefinition = ITestBlock | ITestBlockWithSteps ;
