import { registerAs } from '@nestjs/config';
import {
  getConfigValue,
  getConfigValueNumber,
  getConfigValueBoolean,
} from '@us-epa-camd/easey-common/utilities';

require('dotenv').config();

const host = getConfigValue('EASEY_MONITOR_PLAN_API_HOST', 'localhost');
const port = getConfigValueNumber('EASEY_MONITOR_PLAN_API_PORT', 8010);
const path = getConfigValue('EASEY_MONITOR_PLAN_API_PATH', 'monitor-plan-mgmt');

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

const apiHost = getConfigValue(
  'EASEY_API_GATEWAY_HOST',
  'api.epa.gov/easey/dev',
);

export default registerAs('app', () => ({
  name: 'monitor-plan-api',
  host,
  port,
  path,
  uri,
  title: getConfigValue(
    'EASEY_MONITOR_PLAN_API_TITLE',
    'Monitor Plan Management',
  ),
  description: getConfigValue(
    'EASEY_MONITOR_PLAN_API_DESCRIPTION',
    'Monitor Plan management API endpoints for all monitor plan data & operations',
  ),
  env: getConfigValue('EASEY_MONITOR_PLAN_API_ENV', 'local-dev'),
  apiKey: getConfigValue('EASEY_MONITOR_PLAN_API_KEY'),
  enableApiKey: getConfigValueBoolean('EASEY_MONITOR_PLAN_API_ENABLE_API_KEY'),
  secretToken: getConfigValue('EASEY_MONITOR_PLAN_API_SECRET_TOKEN'),
  
  enableSecretToken: getConfigValueBoolean(
    'EASEY_MONITOR_PLAN_API_ENABLE_SECRET_TOKEN',
  ),
  enableRoleGuard: getConfigValueBoolean(
    'EASEY_MONITOR_PLAN_API_ENABLE_ROLE_GUARD',
    true,
  ),
  enableRoleGuardCheckoutCheck: getConfigValueBoolean(
    'EASEY_MONITOR_PLAN_API_ENABLE_ROLE_GUARD_CHECKOUT',
    true,
  ),
  enableCors: getConfigValueBoolean('EASEY_MONITOR_PLAN_API_ENABLE_CORS', true),
  enableAuthToken: getConfigValueBoolean(
    'EASEY_MONITOR_PLAN_API_ENABLE_AUTH_TOKEN',
    true,
  ),

  enableGlobalValidationPipes: getConfigValueBoolean(
    'EASEY_MONITOR_PLAN_API_ENABLE_GLOBAL_VALIDATION_PIPE',
    true,
  ),
  version: getConfigValue('EASEY_MONITOR_PLAN_API_VERSION', 'v0.0.0'),
  published: getConfigValue('EASEY_MONITOR_PLAN_API_PUBLISHED', 'local'),
  reqSizeLimit: getConfigValue('EASEY_MONITOR_PLAN_API_REQ_SIZE_LIMIT', '1mb'),
  // ENABLES DEBUG CONSOLE LOGS
  enableDebug: getConfigValueBoolean('EASEY_MONITOR_PLAN_API_ENABLE_DEBUG'),
  // NEEDS TO BE SET IN .ENV FILE FOR LOCAL DEVELOPMENT
  // FORMAT: { "userId": "", "roles": [ { "orisCode": 3, "role": "P" } ] }
  currentUser: getConfigValue(
    'EASEY_MONITOR_PLAN_API_CURRENT_USER',
    '{ "userId": "", "roles": [ { "orisCode": 3, "role": "P" } ] }',
  ),
  apiHost: apiHost,
  authApi: {
    uri: getConfigValue('EASEY_AUTH_API', `https://${apiHost}/auth-mgmt`),
  },
}));
