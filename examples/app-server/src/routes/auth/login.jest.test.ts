import {api, run} from 'declarative-e2e-test';
import {config} from '../../tests';
import {loginTestDefinition} from './login.test';

run(loginTestDefinition, {api: api.jest, ...config});
