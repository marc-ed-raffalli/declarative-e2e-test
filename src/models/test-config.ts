import {IApiMapper} from 'declarative-test-structure-generator';
import {ExpectType} from './request';
import {ErrorHandlerType, IWithHeaders} from './shared';

export type logLevelType = 'SILENT' | 'ERROR' | 'DEBUG' | 'TRACE';

export interface ITestRequestConfig extends IWithHeaders {
  url?: string;
  expect?: ExpectType | ExpectType[];
  error?: ErrorHandlerType;
}

export interface ITestConfig {
  logLevel?: logLevelType;
  api: IApiMapper;
  config?: ITestRequestConfig;
  app?: any;
}
