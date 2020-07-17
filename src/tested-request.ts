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
  private response?: Response;

  constructor(
    private props: ITestedRequest,
    private globalRequestConfig: ITestRequestConfig = {}
  ) {
  }

  static buildTestedRequest(props: ITestedRequest, globalRequestConfig?: ITestRequestConfig) {
    return new TestedRequest(props, globalRequestConfig);
  }

  setResponse(resp: Response) {
    this.response = resp;
  }

  evaluateRequestProps(context: any): IEvaluatedProps {
    return evaluateRequestDefinition(this.props, this.globalRequestConfig, context);
  }

  run(context: any, app?: any) {
    return new Promise<Response>((resolve, reject) => {
      const requestProps = this.evaluateRequestProps(context);

      this.initializeAgent(requestProps, app)
        .applyHeaders(requestProps)
        .applyBody(requestProps)
        .applyExpect(requestProps, context, resolve)
        .applyErrorHandler(requestProps, context);
    });
  }

  initializeAgent(requestProps: IEvaluatedProps, app?: any) {
    this.agent = this.createAgent(requestProps, app);
    return this;
  }

  createAgent(requestProps: IEvaluatedProps, app?: any): Test {
    const
      verb = requestProps.verb || 'GET',
      agt = superTestAgent(app || requestProps.url),
      route = app ? requestProps.url : '';

    logger.debug(`${verb} Request to ${requestProps.url} - ${app ? 'app instance provided' : 'no app instance'}`);

    switch (verb) {
      case 'HEAD':
        return agt.head(route);
      case 'POST':
        return agt.post(route);
      case 'PUT':
        return agt.put(route);
      case 'PATCH':
        return agt.patch(route);
      case 'DELETE':
        return agt.delete(route);
      case 'GET':
      default:
        return agt.get(route);
    }
  }

  applyHeaders(requestProps: IEvaluatedProps): TestedRequest {
    if (requestProps.headers && Object.keys(requestProps.headers).length !== 0) {
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

  applyExpect(requestProps: IEvaluatedProps, context?: any, done?: fnType): TestedRequest {
    // keep the response for error callback
    this.agent = this.agent!.expect((resp) => this.setResponse(resp));

    this.agent = requestProps.expect
      .reduce((agent, expect) => {
        switch (typeof expect) {
          case 'number':
          case 'string':
            return agent.expect(expect);
          case 'function':
            return agent.expect(expect.bind(context));

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

  applyErrorHandler(requestProps: IEvaluatedProps, context?: any) {
    this.agent!.catch((error) => {
      logger.error(error);

      if (requestProps.error) {
        requestProps!.error.call(context, error, this.response as Response);
        return;
      }

      logger.error(`Error caught, use property "error" in the request definition to access error the object`);
    });

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
    url: `${globalRequestConfig.url || ''}${requestProps.url}`,
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
