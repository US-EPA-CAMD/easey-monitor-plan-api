import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';

import routes from './routes';
import dbConfig from './config/db.config'
import appConfig from './config/app.config'
import { TypeOrmConfigService } from './config/typeorm.config';
import { MonitorPlanModule } from './monitor-plan/monitor-plan.module';
import { MonitorLocationModule } from './monitor-location/monitor-location.module';
import { MonitorMethodModule } from './monitor-method/monitor-method.module'
import { SupplementalMethodsModule} from "./supplemental-methods/supplemental-methods.module"
import { MonitorSystemModule} from "./monitor-system/monitor-system.module"
import{ComponentModule} from"./component/component.module"

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        dbConfig,
        appConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MonitorPlanModule,
    MonitorLocationModule,    
    MonitorMethodModule,
    SupplementalMethodsModule,
    MonitorSystemModule,
    ComponentModule
  ],
})
export class AppModule {}
