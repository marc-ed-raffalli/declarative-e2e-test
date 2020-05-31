import {agent as superTestAgent, Response, Test} from 'supertest';
import {
  ErrorHandlerType,
  ExpectType,
  fnType,
  HeadersType,
  ITestedRequest,
  ITestRequestConfig,
  IWithHeaders,
  SupportedHttpVerb
} from './models';
import {Logger} from './utils/logger';

export interface IEvaluatedProps extends IWithHeaders {
  verb?: SupportedHttpVerb;
  url: string;
  body?: any;
  expect: ExpectType[];
  error?: ErrorHandlerType;
}

const logger = Logger.getLogger();

export class TestedRequest {

  private agent?: Test;

  constructor(
    private props: ITestedRequest,
    private globalRequestConfig: ITestRequestConfig = {}
  ) {
  }

  static buildTestedRequest(props: ITestedRequest, globalRequestConfig?: ITestRequestConfig) {
    return new TestedRequest(props, globalRequestConfig);
  }

  evaluateRequestProps(context: any): IEvaluatedProps {
    return evaluateRequestDefinition(this.props, this.globalRequestConfig, context);
  }

  run(context: any) {
    return new Promise<Response>((resolve, reject) => {
      const requestProps = this.evaluateRequestProps(context);

      this.initializeAgent(requestProps)
        .applyHeaders(requestProps)
        .applyBody(requestProps)
        .applyExpect(requestProps, resolve);
    });
  }

  initializeAgent(requestProps: IEvaluatedProps) {
    this.agent = this.createAgent(requestProps);
    return this;
  }

  createAgent(requestProps: IEvaluatedProps): Test {
    const
      verb = requestProps.verb || 'GET',
      agt = superTestAgent(requestProps.url);

    logger.debug(`${verb} Request to ${requestProps.url}`);

    switch (verb) {
      case 'HEAD':
        return agt.head('');
      case 'POST':
        return agt.post('');
      case 'PUT':
        return agt.put('');
      case 'PATCH':
        return agt.patch('');
      case 'DELETE':
        return agt.delete('');
      case 'GET':
      default:
        return agt.get('');
    }
  }

  applyHeaders(requestProps: IEvaluatedProps): TestedRequest {
    if (requestProps.headers) {
      logger.trace('Request headers applied:', requestProps.headers);
      this.agent = this.agent!.set(requestProps.headers);
    }

    return this;
  }

  applyBody(requestProps: IEvaluatedProps): TestedRequest {
    if (requestProps.body) {
      logger.trace('Request body applied:', requestProps.body);
      this.agent = this.agent!.send(requestProps.body);
    }

    return this;
  }

  applyExpect(requestProps: IEvaluatedProps, done?: fnType): TestedRequest {
    this.agent = requestProps.expect
      .reduce((agent, expect) => {
        switch (typeof expect) {
          case 'number':
          case 'string':
          case 'function':
            return agent.expect(expect);

          case 'object':
            const
              hasExpectedHeaders = 'headers' in expect,
              hasExpectedBody = 'body' in expect
            ;

            if (hasExpectedHeaders) {
              agent = Object.entries(expect.headers as HeadersType)
                .reduce((agt, [key, value]) => {
                  if (!Array.isArray(value)) {
                    return agt.expect(key, value);
                  }

                  for (const val of value) {
                    agt = agt.expect(key, val);
                  }

                  return agt;
                }, agent);
            }

            if (hasExpectedBody) {
              agent = agent.expect(expect.body);
            }

            if (!hasExpectedHeaders && !hasExpectedBody) {
              agent = agent.expect(expect);
            }

            return agent;
          default:
            logger.error(`Unsupported type: ${typeof expect} for expect`);
            return agent;
        }
      }, this.agent as Test);

    if (done) {
      this.agent!.then(done);
    }

    return this;
  }

}

function evaluateRequestDefinition(
  props: ITestedRequest,
  globalRequestConfig: ITestRequestConfig,
  context: any
) {
  const
    {verb, url, headers, body, expect, error} = props,
    requestProps = {
      verb,
      url: evaluateValue(url, context),
      headers: evaluateValue(headers, context),
      body: evaluateValue(body, context),
      expect,
      error
    };

  logger.trace(`Request URL in global config: "${globalRequestConfig.url}", test definition: ${requestProps.url}`);
  return {
    ...requestProps,
    url: globalRequestConfig.url
      ? `${globalRequestConfig.url}${requestProps.url}`
      : requestProps.url,
    headers: {
      ...globalRequestConfig.headers,
      ...requestProps.headers
    },
    expect: [requestProps.expect, globalRequestConfig.expect]
      .filter(e => e !== undefined)
      .flat() as ExpectType[]
  };
}

function evaluateValue<T>(value: T | fnType<T>, context: any): T {
  if (typeof value !== 'function') {
    return value;
  }

  const valueGetter = value as fnType<T>;
  return valueGetter.call(context);
}
