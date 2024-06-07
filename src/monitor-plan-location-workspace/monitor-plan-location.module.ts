import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanLocationWorkspaceRepository } from './monitor-plan-location.repository';
import { MonitorPlanLocationService } from './monitor-plan-location.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorPlanLocationWorkspaceRepository])],
  controllers: [],
  providers: [
    MonitorPlanLocationWorkspaceRepository,
    MonitorPlanLocationService,
  ],
  exports: [
    TypeOrmModule,
    MonitorPlanLocationWorkspaceRepository,
    MonitorPlanLocationService,
  ],
})
export class MonitorPlanLocationModule {}
