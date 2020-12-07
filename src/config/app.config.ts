import { registerAs } from '@nestjs/config';

const title = 'Monitor Plan Management';
const path = 'api/monitor-plan-mgmt';
const host = process.env.EASEY_API_HOST || 'localhost';
const port = process.env.EASEY_MONITOR_PLAN_MGMT_API_PORT || 8000;

let uri = `https://${host}/${path}`

if (host == 'localhost') {
  uri = `http://localhost:${port}/${path}`;
}

export default registerAs('app', () => ({
  title,
  path,
  host,
  port,
  uri,
}));