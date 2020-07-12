import {api, run} from 'declarative-e2e-test';
import {config} from '../../tests';
import {profileTestDefinition} from './profile.test';

run(profileTestDefinition, {api: api.jest, ...config});
