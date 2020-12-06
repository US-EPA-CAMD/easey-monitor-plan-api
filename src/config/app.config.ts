import { registerAs } from '@nestjs/config';

const title = 'Monitor Plan Management';
const path = 'api/monitor-plan-mgmt';
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;

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