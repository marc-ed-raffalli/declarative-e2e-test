import {Response} from 'supertest';

type headerObject<SupportedValueType> = { [k: string]: SupportedValueType | SupportedValueType[] };

export type fnType<Return = void> = () => Return;
export type HeadersType<SupportedValueType = (string | number)> =
  headerObject<SupportedValueType>
  | fnType<headerObject<SupportedValueType>>;
export type ErrorHandlerType = (err: any, resp: Response) => void;

export interface IWithName {
  name: string;
}

export interface IWithHeaders {
  headers?: HeadersType;
}
