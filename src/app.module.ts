import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RouterModule } from 'nest-router';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CheckCatalogModule } from '@us-epa-camd/easey-common/check-catalog';
import { dbConfig } from '@us-epa-camd/easey-common/config';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CorsOptionsModule } from '@us-epa-camd/easey-common/cors-options';
import { ConnectionModule } from '@us-epa-camd/easey-common/connection';
import { DbLookupValidator } from '@us-epa-camd/easey-common/validators';

import routes from './routes';
import appConfig from './config/app.config';
import { MessagesModule } from './messages/messages.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { MonitorPlanModule } from './monitor-plan/monitor-plan.module';
import { MonitorPlanWorkspaceModule } from './monitor-plan-workspace/monitor-plan.module';
import { CountyCodeModule } from './county-code/county-code.module';
import { CheckOutModule } from './check-out/check-out.module';
import { MonitorPlanLocationModule } from './monitor-plan-location-workspace/monitor-plan-location.module';
import { MonitorPlanReportingFreqModule } from './monitor-plan-reporting-freq/monitor-plan-reporting-freq.module';
import { MonitorConfigurationsModule } from './monitor-configurations/monitor-configurations.module';
import { MonitorConfigurationsWorkspaceModule } from './monitor-configurations-workspace/monitor-configurations-workspace.module';
import { SystemComponentMasterDataRelationshipModule } from './system-component-master-data-relationship/system-component-master-data-relationship.module';
import { UsedIdentifierModule } from './used-identifier/used-identifier.module';
import { WhatHasDataModule } from './what-has-data/what-has-data.module';
import { StackPipeWorkspaceModule } from './stack-pipe-workspace/stack-pipe.module';

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
    CheckCatalogModule.register(
      'camdecmpsmd.vw_monitor_plan_api_check_catalog_results',
    ),
    HttpModule,
    LoggerModule,
    CorsOptionsModule,
    ConnectionModule,
    MessagesModule,
    MonitorPlanModule,
    MonitorConfigurationsModule,
    MonitorConfigurationsWorkspaceModule,
    MonitorPlanWorkspaceModule,
    CountyCodeModule,
    CheckOutModule,
    MonitorPlanLocationModule,
    MonitorPlanReportingFreqModule,
    SystemComponentMasterDataRelationshipModule,
    UsedIdentifierModule,
    WhatHasDataModule,
    StackPipeWorkspaceModule,
  ],
  providers: [DbLookupValidator],
})
export class AppModule {}
