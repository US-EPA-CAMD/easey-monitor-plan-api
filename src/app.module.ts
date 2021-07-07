/***** external modules *****/
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';

/***** routes / config *****/
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import routes from './routes';

/***** services *****/
import { TypeOrmConfigService } from './config/typeorm.config';

/***** internal modules *****/
import { AnalyzerRangeModule } from './analyzer-range/analyzer-range.module';
import { ComponentModule } from './component/component.module';
import { MonitorFormulaModule } from './monitor-formula/monitor-formula.module';
import { MonitorLoadModule } from './monitor-load/monitor-load.module';
import { MonitorLocationModule } from './monitor-location/monitor-location.module';
import { MonitorLocationWorkspaceModule } from './monitor-location-workspace/monitor-location.module';
import { MonitorMethodModule } from './monitor-method/monitor-method.module';
import { MonitorMethodWorkspaceModule } from './monitor-method-workspace/monitor-method.module';
import { MonitorPlanModule } from './monitor-plan/monitor-plan.module';
import { MonitorPlanWorkspaceModule } from './monitor-plan-workspace/monitor-plan.module';
import { MonitorSpanModule } from './monitor-span/monitor-span.module';
import { MonitorSystemModule } from './monitor-system/monitor-system.module';
import { MatsMethodModule } from './mats-method/mats-method.module';
import { SystemComponentModule } from './system-component/system-component.module';
import { SystemFuelFlowModule } from './system-fuel-flow/system-fuel-flow.module';

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
    MonitorPlanModule,
    MonitorPlanWorkspaceModule,
    MonitorLocationModule,
    MonitorLocationWorkspaceModule,
    MonitorMethodModule,
    MonitorMethodWorkspaceModule,
    MatsMethodModule,
    ComponentModule,
    AnalyzerRangeModule,
    MonitorSystemModule,
    SystemComponentModule,
    SystemFuelFlowModule,
    MonitorSpanModule,
    MonitorLoadModule,
    MonitorFormulaModule,
  ],
})
export class AppModule {}
