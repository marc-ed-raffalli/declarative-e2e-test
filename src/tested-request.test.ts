import {agent as sTMock, Response} from 'supertest';
import {ITestedRequest} from './models';
import {IEvaluatedProps, TestedRequest} from './tested-request';
import Mock = jest.Mock;

// @ts-ignore - issue with typings (?)
const superTestMock: () => ReturnType<typeof sTMock> & { expect: any, send: any, catch: any } = sTMock;

describe('TestedRequest', () => {

  let url: string,
    testedRequest: TestedRequest,
    evaluatedProps: IEvaluatedProps,
    context: any,
    props: ITestedRequest
  ;

  beforeEach(() => {
    url = 'https://mock-url.ie';
    context = {testContext: 'foo'};
    props = {
      url: '/some/pathname',
      verb: 'POST',
      headers: {some: 'headers'},
      body: {some: 'body'},
      expect: 200,
      error: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Factory', () => {

    it('buildTestedRequest returns built instance', () => {
      expect(TestedRequest.buildTestedRequest({url, expect: 200})).toBeInstanceOf(TestedRequest);
    });

  });

  describe('Supported verbs', () => {

    async function verifyRun(method: keyof ReturnType<typeof sTMock>) {
      expect(superTestMock()[method]).not.toHaveBeenCalled();

      await testedRequest.run({});

      expect(superTestMock()[method]).toHaveBeenCalledWith('');
      expect(superTestMock).toHaveBeenCalledWith(url);
    }

    it('GET - default', async () => {
      testedRequest = new TestedRequest({url, expect: [200]});

      await verifyRun('get');
    });

    it('HEAD', async () => {
      testedRequest = new TestedRequest({url, verb: 'HEAD', expect: [200]});

      await verifyRun('head');
    });

    it('POST', async () => {
      testedRequest = new TestedRequest({url, verb: 'POST', expect: [200]});

      await verifyRun('post');
    });

    it('PUT', async () => {
      testedRequest = new TestedRequest({url, verb: 'PUT', expect: [200]});

      await verifyRun('put');
    });

    it('PATCH', async () => {
      testedRequest = new TestedRequest({url, verb: 'PATCH', expect: [200]});

      await verifyRun('patch');
    });

    it('DELETE', async () => {
      testedRequest = new TestedRequest({url, verb: 'DELETE', expect: [200]});

      await verifyRun('delete');
    });

  });

  describe('evaluateRequestProps', () => {

    it('returns values', () => {
      testedRequest = new TestedRequest(props);

      expect(testedRequest.evaluateRequestProps({})).toEqual({...props, expect: [200]});
    });

    it('returns values merged with global config', () => {
      testedRequest = new TestedRequest(props, {
        url,
        headers: {some: 'overridden header', foo: 'Foo header'},
        expect: [{headers: {foo: 'Expected foo header'}}]
      });

      expect(testedRequest.evaluateRequestProps({})).toEqual({
        ...props,
        url: `${url}${props.url}`,
        headers: {...props.headers, foo: 'Foo header'},
        expect: [props.expect, {headers: {foo: 'Expected foo header'}}]
      });
    });

    it('returns values', () => {
      testedRequest = new TestedRequest({
        ...props,
        url: () => props.url as string,
        headers: () => props.headers as any,
        body: () => props.body
      });

      expect(testedRequest.evaluateRequestProps({})).toEqual({...props, expect: [200]});
    });

    it('getters are called with context', () => {
      props = {
        ...props,
        url: jest.fn(),
        headers: jest.fn(),
        body: jest.fn()
      };
      testedRequest = new TestedRequest(props);

      testedRequest.evaluateRequestProps(context);

      verifyCallContext(props.url, context);
      verifyCallContext(props.headers, context);
      verifyCallContext(props.body, context);
    });

    function verifyCallContext(spy: any, callContext: any) {
      expect(spy.mock.instances[0]).toEqual(callContext);
    }

  });

  describe('run', () => {

    it('calls methods with extracted props', async () => {
      const stub: IEvaluatedProps = {url: 'stub-url', expect: [200]};

      testedRequest = new TestedRequest(props);

      spyOn(testedRequest, 'evaluateRequestProps').and.returnValue(stub);
      spyOn(testedRequest, 'initializeAgent').and.callThrough();
      spyOn(testedRequest, 'applyHeaders').and.callThrough();
      spyOn(testedRequest, 'applyBody').and.callThrough();
      spyOn(testedRequest, 'applyExpect').and.callThrough();

      await testedRequest.run(context);

      expect(testedRequest.evaluateRequestProps).toHaveBeenCalledWith(context);
      expect(testedRequest.initializeAgent).toHaveBeenCalledWith(stub);
      expect(testedRequest.applyHeaders).toHaveBeenCalledWith(stub);
      expect(testedRequest.applyBody).toHaveBeenCalledWith(stub);
      expect(testedRequest.applyExpect).toHaveBeenCalledWith(stub, context, expect.any(Function));
    });

  });

  describe('Helper API', () => {

    beforeEach(() => {
      evaluatedProps = {
        url,
        headers: {foo: 'foo header'},
        body: {some: 'body'},
        expect: [200]
      };

      testedRequest = new TestedRequest(props);
      testedRequest.initializeAgent(evaluatedProps);
    });

    describe('applyHeaders', () => {

      it('sets headers', async () => {
        testedRequest.applyHeaders(evaluatedProps);

        expect(superTestMock().set).toHaveBeenCalledWith(evaluatedProps.headers);
      });

      it('skip when headers is not provided', async () => {
        delete evaluatedProps.headers;

        testedRequest.applyHeaders(evaluatedProps);

        expect(superTestMock().set).not.toHaveBeenCalled();
      });

    });

    describe('applyBody', () => {

      it('sets body', async () => {
        testedRequest.applyBody(evaluatedProps);

        expect(superTestMock().send).toHaveBeenCalledWith(evaluatedProps.body);
      });

      it('skip when body is not provided', async () => {
        delete evaluatedProps.body;

        testedRequest.applyBody(evaluatedProps);

        expect(superTestMock().send).not.toHaveBeenCalled();
      });

    });

    describe('applyExpect', () => {

      it('evaluates - simple object', () => {
        evaluatedProps.expect = [{some: 'response'}];

        testedRequest.applyExpect(evaluatedProps);
        expect(superTestMock().expect).toHaveBeenCalledWith({some: 'response'});
      });

      it('evaluates - RegExp', () => {
        evaluatedProps.expect = [/responseCheck/];

        testedRequest.applyExpect(evaluatedProps);
        expect(superTestMock().expect).toHaveBeenCalledWith(/responseCheck/);
      });

      it('evaluates headers', () => {
        evaluatedProps.expect = [{headers: {foo: 'foo header', bar: ['bar-header-1', /bar-header-2/]}}];

        testedRequest.applyExpect(evaluatedProps);
        expect(superTestMock().expect).toHaveBeenCalledWith('foo', 'foo header');
        expect(superTestMock().expect).toHaveBeenCalledWith('bar', 'bar-header-1');
        expect(superTestMock().expect).toHaveBeenCalledWith('bar', /bar-header-2/);
      });

      it('evaluates headers + body', () => {
        evaluatedProps.expect = [{
          headers: {foo: 'foo header', bar: 'bar header'},
          body: {evaluated: 'body'}
        }];

        testedRequest.applyExpect(evaluatedProps);
        expect(superTestMock().expect).toHaveBeenCalledWith('foo', 'foo header');
        expect(superTestMock().expect).toHaveBeenCalledWith('bar', 'bar header');
        expect(superTestMock().expect).toHaveBeenCalledWith({evaluated: 'body'});
      });

      it('custom response callback', () => {
        evaluatedProps.expect = [jest.fn()];

        testedRequest.applyExpect(evaluatedProps);
        expect(superTestMock().expect).toHaveBeenCalledWith(expect.any(Function));
        expect(evaluatedProps.expect[0]).toHaveBeenCalledWith({mockResponse: 'foo'});
      });

      it('list of expectations', () => {
        evaluatedProps.expect = [200, {headers: {foo: 'foo header'}}];

        testedRequest.applyExpect(evaluatedProps);
        expect(superTestMock().expect).toHaveBeenCalledWith(200);
        expect(superTestMock().expect).toHaveBeenCalledWith('foo', 'foo header');
      });

      it('skips unsupported types', () => {
        evaluatedProps.expect = [true];

        testedRequest.applyExpect(evaluatedProps);
        // calls the response setter only
        expect(superTestMock().expect).toHaveBeenCalledTimes(1);
      });

    });

    describe('applyErrorHandler', () => {

      it('calls provided callback on error', () => {
        const
          mockError = new Error('Foo'),
          mockResp = {status: 200, body: 'foo'};

        (superTestMock().catch as Mock).mockImplementationOnce((cb) => cb(mockError));

        evaluatedProps.error = jest.fn();
        testedRequest.setResponse(mockResp as Response);
        testedRequest.applyErrorHandler(evaluatedProps);

        expect(evaluatedProps.error).toHaveBeenCalledWith(mockError, mockResp);
      });

    });

  });

});
