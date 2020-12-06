import { registerAs } from '@nestjs/config';

let pgHost = process.env.PG_HOST || 'database';
let pgPort = process.env.PG_PORT || 5432;
let pgUser = process.env.PG_USER || 'postgres';
let pgPwd = process.env.PG_PWD || 'password';
let pgDb = process.env.PG_DB || 'postgres';

if (process.env.VCAP_SERVICES) {
  const vcapSvc = JSON.parse(process.env.VCAP_SERVICES);
  const vcapSvcCreds = vcapSvc['aws-rds'][0].credentials;
  
  pgHost = vcapSvcCreds.host;
  pgPort = +vcapSvcCreds.port;
  pgUser = vcapSvcCreds.username;
  pgPwd = vcapSvcCreds.password;
  pgDb = vcapSvcCreds.name;
}

export default registerAs('database', () => ({
  host: pgHost,
  port: pgPort,
  user: pgUser,
  pwd: pgPwd,
  name: pgDb,
}));