import {api, run} from 'declarative-e2e-test';
import {profileTestDefinition} from './profile.test';

run(profileTestDefinition, {api: api.jest, logLevel: 'TRACE'});
