import {ITest} from 'declarative-test-structure-generator';
import {Response} from 'supertest';
import {ITestRequestConfig, IWithName, TestBlockDefinition} from './models';
import {TestedRequest} from './tested-request';
import {Logger} from './utils/logger';

const logger = Logger.getLogger();

export class TestBlock {

  constructor(
    private definition: TestBlockDefinition & IWithName,
    private globalRequestConfig: ITestRequestConfig = {}
  ) {
  }

  generate(): ITest & IWithName {
    const generateTestWithContext = (context: any) => this.generateTest(context),
      {name, skip, only} = this.definition;

    return {
      name,
      skip,
      only,
      test() {
        return generateTestWithContext(this);
      }
    };
  }

  generateTest(context: any): Promise<Response> {
    const testDefinitionArr = 'steps' in this.definition
      ? this.definition.steps
      : [this.definition];

    const testRequestDetails = testDefinitionArr.length === 1 ? '1 request' : `${testDefinitionArr.length} steps`;
    logger.debug(`Starting test "${this.definition.name}" with ${testRequestDetails}, context:`, context);

    return testDefinitionArr
      .reduce((previousRequest, stepDef, stepIndex) =>
          previousRequest.then(resp => {

            if (testDefinitionArr.length !== 1) {
              const
                requestIndexVsCount = `Request ${stepIndex + 1} out of ${testDefinitionArr.length}`,
                message = stepIndex === 0
                  ? [requestIndexVsCount]
                  : [`${requestIndexVsCount}, previous request returned response`, resp];
              logger.debug.apply(logger, message);
            }

            stepDef = typeof stepDef === 'function'
              ? stepDef(resp)
              : stepDef;

            return TestedRequest.buildTestedRequest(stepDef, this.globalRequestConfig).run(context);
          }),
        Promise.resolve<Response>({} as Response)
      );
  }

}
