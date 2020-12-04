import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const appTitle = 'Monitor-Plan';
const appPath = `api/${appTitle.toLowerCase()}`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(appPath);
  app.enableCors();  

  const options = new DocumentBuilder()
    .setTitle(`${appTitle} OpenAPI`)
    .setDescription(`${appTitle} OpenAPI specification`)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${appPath}/swagger`, app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}/${appPath}`);
}

bootstrap();

