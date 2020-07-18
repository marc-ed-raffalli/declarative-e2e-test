import {api, run} from 'declarative-e2e-test';
import {config} from '../tests';
import {statusTestDefinition} from './status.test';

run(statusTestDefinition, {api: api.jest, ...config});
