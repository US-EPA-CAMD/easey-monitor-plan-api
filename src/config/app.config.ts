require('dotenv').config();
import { registerAs } from '@nestjs/config';
import { parseBool } from '@us-epa-camd/easey-common/utilities';

const path = process.env.EASEY_MONITOR_PLAN_API_PATH || 'monitor-plan-mgmt';
const host = process.env.EASEY_MONITOR_PLAN_API_HOST || 'localhost';
const port = +process.env.EASEY_MONITOR_PLAN_API_PORT || 8010;

let uri = `https://${host}/${path}`;

if (host === 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

export default registerAs('app', () => ({
  name: 'monitor-plan-api',
  title: process.env.EASEY_MONITOR_PLAN_API_TITLE || 'Monitor Plan Management',
  path,
  host,
  apiHost: process.env.EASEY_API_GATEWAY_HOST || 'api.epa.gov/easey/dev',
  port,
  uri,
  apiKey: process.env.EASEY_MONITOR_PLAN_API_KEY,
  env: process.env.EASEY_MONITOR_PLAN_API_ENV || 'local-dev',
  enableCors: parseBool(
    process.env.EASEY_MONITOR_PLAN_API_ENABLE_CORS,
    true,
  ),
  enableApiKey: parseBool(
    process.env.EASEY_MONITOR_PLAN_API_ENABLE_API_KEY,
  ),
  enableAuthToken: parseBool(
    process.env.EASEY_MONITOR_PLAN_API_ENABLE_AUTH_TOKEN,
  ),
  enableGlobalValidationPipes: parseBool(
    process.env.EASEY_MONITOR_PLAN_API_ENABLE_GLOBAL_VALIDATION_PIPE,
    true,
  ),
  version: process.env.EASEY_MONITOR_PLAN_API_VERSION || 'v0.0.0',
  published: process.env.EASEY_MONITOR_PLAN_API_PUBLISHED || 'local',
  authApi: {
    uri: process.env.EASEY_AUTH_API || 'https://api.epa.gov/easey/dev/auth-mgmt',
  },
  reqSizeLimit: process.env.EASEY_MONITOR_PLAN_API_REQ_SIZE_LIMIT || '1mb',
  enableSecretToken: parseBool(
    process.env.EASEY_MONITOR_PLAN_API_ENABLE_SECRET_TOKEN,
  ),
  // ENABLES DEBUG CONSOLE LOGS
  enableDebug: parseBool(
    process.env.EASEY_MONITOR_PLAN_API_ENABLE_DEBUG,
  ),
  // NEEDS TO BE SET IN .ENV FILE FOR LOCAL DEVELOPMENT
  // FORMAT: { "userId": "", "roles": [ { "orisCode": 3, "role": "P" } ] }
  currentUser: process.env.EASEY_MONITOR_PLAN_API_CURRENT_USER,
}));
