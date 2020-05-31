import {Response} from 'supertest';
import {ErrorHandlerType, fnType, HeadersType, IWithHeaders} from './shared';

export type SupportedHttpVerb = 'HEAD'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export type ExpectType = number
  | string
  | any
  | { headers?: HeadersType<string | RegExp>, body?: any | fnType<any> }
  | ((resp: Response) => void);

export interface IRequest extends IWithHeaders {
  verb?: SupportedHttpVerb;
  url: string | fnType<string>;
  body?: any | fnType<any>;
}

export interface ITestedRequest extends IRequest {
  expect: ExpectType | ExpectType[];
  error?: ErrorHandlerType;
}
