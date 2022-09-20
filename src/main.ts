import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  applySwagger,
  applyMiddleware,
} from '@us-epa-camd/easey-common/nestjs';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await CheckCatalogService.load(
    'camdecmpsmd.vw_monitor_plan_api_check_catalog_results',
  );

  await applyMiddleware(AppModule, app, false, true);
  await applySwagger(app);

  const configService = app.get(ConfigService);
  const appPath = configService.get<string>('app.path');
  const appPort = configService.get<number>('app.port');

  const server = await app.listen(appPort);
  server.setTimeout(1800000);

  console.log(
    `Application is running on: ${await app.getUrl()}/${appPath}/swagger`,
  );
}

bootstrap();
