import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorPlanReportingFrequencyMap } from '../maps/monitor-plan-reporting-freq.map';
import { MonitorPlanReportingFrequencyWorkspaceRepository } from './monitor-plan-reporting-freq.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorPlanReportingFrequencyWorkspaceRepository,
    ]),
  ],
  controllers: [],
  providers: [MonitorPlanReportingFrequencyMap],
  exports: [TypeOrmModule, MonitorPlanReportingFrequencyMap],
})
export class MonitorPlanReportingFreqWorkspaceModule {}
