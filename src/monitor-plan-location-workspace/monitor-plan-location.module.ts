import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorPlanLocationWorkspaceRepository } from './monitor-plan-location.repository';
import { MonitorPlanLocationService } from './monitor-plan-location.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorPlanLocationWorkspaceRepository])],
  controllers: [],
  providers: [MonitorPlanLocationService],
  exports: [TypeOrmModule, MonitorPlanLocationService],
})
export class MonitorPlanLocationModule {}
