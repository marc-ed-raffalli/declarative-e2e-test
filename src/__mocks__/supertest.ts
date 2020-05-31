import {fnType} from '../models';

interface ITestedApi {
  set: (...args: any) => ITestedApi;
  send: (...args: any) => ITestedApi;
  then: (cb: fnType) => void;

  head: (...args: any) => ITestedApi;
  get: (...args: any) => ITestedApi;
  post: (...args: any) => ITestedApi;
  put: (...args: any) => ITestedApi;
  patch: (...args: any) => ITestedApi;
  delete: (...args: any) => ITestedApi;
  expect: (...args: any) => ITestedApi;
  end: (...args: any) => ITestedApi;
}

const
  mockWithReturn = (): any =>
    jest.fn()
      .mockImplementation(() => st),
  st: ITestedApi = {
    set: mockWithReturn(),
    send: mockWithReturn(),
    then: (cb) => cb(),
    expect: mockWithReturn(),
    end: mockWithReturn(),

    head: mockWithReturn(),
    get: mockWithReturn(),
    post: mockWithReturn(),
    put: mockWithReturn(),
    patch: mockWithReturn(),
    delete: mockWithReturn()
  };

// returns singleton to ease API testing
export const agent = jest.fn().mockReturnValue(st);
