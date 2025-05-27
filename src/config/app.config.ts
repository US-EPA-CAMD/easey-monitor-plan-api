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
  logFile: getConfigValue('EASEY_MONITOR_PLAN_API_LOG_FILE'),
  logFileLevel: getConfigValue('EASEY_MONITOR_PLAN_API_LOG_FILE_LEVEL'),
  /**
   * Needs to be set in .env file for local development if `EASEY_EMISSIONS_API_ENABLE_AUTH_TOKEN` is false.
   * Format:
   *   {
   *       "facilities": [
   *           { "facId": number, "orisCode": number, "permissions": string[] }
   *       ],
   *       "roles": <"Preparer" | "Submitter" | "Sponsor">[],
   *       "userId": string
   *   }
   */
  currentUser: getConfigValue(
    'EASEY_MONITOR_PLAN_API_CURRENT_USER',
    '{ "userId": "" }',
  ),
  apiHost: apiHost,
  authApi: {
    uri: getConfigValue('EASEY_AUTH_API', `https://${apiHost}/auth-mgmt`),
  },
  contentApi: {
    uri: getConfigValue('EASEY_CONTENT_API', `https://${apiHost}/content-mgmt`),
  },
  maxConnectionPool: getConfigValueNumber('EASEY_DB_MAX_CONNECTION_POOL',15),
  idleTimeout: getConfigValueNumber( 'EASEY_DB_IDLE_TIMEOUT', 30000, ),
  connectionTimeout: getConfigValueNumber('EASEY_DB_CONNECTION_TIMEOUT',10000),
  statementTimeout: getConfigValueNumber('EASEY_DB_STATEMENT_TIMEOUT',300000),
  idleInTransactionSessionTimeout: getConfigValueNumber('EASEY_DB_IDLE_TRANS_SESSION_TIMEOUT',300000),
  sqlLogging: getConfigValue('EASEY_DB_SQL_LOGGING', "error"),
  maxQueryExecutionTime: getConfigValueNumber('EASEY_DB_MAX_QUERY_EXECUTION_TIMEOUT',30000),
  maxUsesBeforeRecreatingConnection: getConfigValueNumber('EASEY_DB_MAX_USES_BEFORE_CONN_RECREATE',500),
  enableAuditLog: getConfigValueBoolean('EASEY_MONITOR_PLAN_API_ENABLE_AUDIT_LOG', true)
}));
