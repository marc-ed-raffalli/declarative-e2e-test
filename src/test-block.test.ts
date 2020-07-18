import {ITest} from 'declarative-test-structure-generator';
import {ITestRequestConfig, IWithName, TestBlockDefinition} from './models';
import {TestBlock} from './test-block';
import {TestedRequest} from './tested-request';

describe('TestBlock', () => {

  let
    url: string,
    name: string,
    res: ITest;

  beforeEach(() => {
    name = 'Foo test';
    url = 'https://mock-url.ie';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function generate(props: TestBlockDefinition & IWithName, config?: ITestRequestConfig) {
    res = new TestBlock(props, config).generate();
  }

  describe('Generated test declaration', () => {

    it('generates test definition object', () => {
      generate({name, url, expect: 200});

      expect(res).toMatchObject({
        only: undefined,
        skip: undefined,
        test: expect.any(Function)
      });
    });

    it('generates test definition object - skip', () => {
      generate({name, url, expect: 200, skip: true});

      expect(res).toMatchObject({
        only: undefined,
        skip: true,
        test: expect.any(Function)
      });
    });

    it('generates test definition object - only', () => {
      generate({name, url, expect: 200, only: true});

      expect(res).toMatchObject({
        only: true,
        skip: undefined,
        test: expect.any(Function)
      });
    });

  });

  describe('Generated test', () => {

    let
      context: any,
      testRequestStub: any;

    beforeEach(() => {
      context = {};
      testRequestStub = {run: jest.fn()};
      spyOn(TestedRequest, 'buildTestedRequest').and.returnValue(testRequestStub);
    });

    it('runs single request', async () => {
      const props = {name, url, expect: 200};
      generate(props);

      await res.test(jest.fn());

      expect(TestedRequest.buildTestedRequest).toHaveBeenCalledWith(props, {});
    });

    describe('Steps', () => {

      it('runs stepped requests', async () => {
        const props: TestBlockDefinition & IWithName = {
          name,
          steps: [
            {url: 'foo', expect: 200},
            {url: 'bar', expect: 201},
            jest.fn().mockReturnValue({url: 'baz', expect: 202}),
          ]
        };

        let requestExecuted = 0;
        const mockResponses = ['aaa', 'bbb', 'ccc'];
        testRequestStub.run.mockImplementation(() => Promise.resolve(mockResponses[(++requestExecuted) - 1]));

        generate(props);

        await res.test(jest.fn());

        expect(TestedRequest.buildTestedRequest).toHaveBeenNthCalledWith(1, {url: 'foo', expect: 200}, {});
        expect(TestedRequest.buildTestedRequest).toHaveBeenNthCalledWith(2, {url: 'bar', expect: 201}, {});
        expect(TestedRequest.buildTestedRequest).toHaveBeenNthCalledWith(3, {url: 'baz', expect: 202}, {});
        expect(requestExecuted).toEqual(3);
        expect(props.steps[2]).toHaveBeenCalledWith('bbb');
      });

    });

  });

});
