/***** external modules *****/
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CorsOptionsModule } from '@us-epa-camd/easey-common/cors-options';

/***** routes / config *****/
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import routes from './routes';

/***** services *****/
import { TypeOrmConfigService } from './config/typeorm.config';

/***** internal modules *****/
import { MonitorPlanModule } from './monitor-plan/monitor-plan.module';
import { MonitorPlanWorkspaceModule } from './monitor-plan-workspace/monitor-plan.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    LoggerModule,
    CorsOptionsModule,
    MonitorPlanModule,
    MonitorPlanWorkspaceModule,
  ],
})
export class AppModule {}
