import {api, run} from 'declarative-e2e-test';
import {config} from '../../tests';
import {logoutTestDefinition} from './logout.test';

run(logoutTestDefinition, {api: api.jest, ...config});
