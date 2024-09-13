import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanReportingFrequencyMap } from '../maps/monitor-plan-reporting-freq.map';
import { MonitorPlanReportingFrequencyWorkspaceController } from './monitor-plan-reporting-freq.controller';
import { MonitorPlanReportingFrequencyWorkspaceRepository } from './monitor-plan-reporting-freq.repository';
import { MonitorPlanReportingFrequencyWorkspaceService } from './monitor-plan-reporting-freq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitorPlanReportingFrequencyWorkspaceRepository,
    ]),
    HttpModule,
  ],
  controllers: [MonitorPlanReportingFrequencyWorkspaceController],
  providers: [
    MonitorPlanReportingFrequencyMap,
    MonitorPlanReportingFrequencyWorkspaceRepository,
    MonitorPlanReportingFrequencyWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    MonitorPlanReportingFrequencyMap,
    MonitorPlanReportingFrequencyWorkspaceRepository,
    MonitorPlanReportingFrequencyWorkspaceService,
  ],
})
export class MonitorPlanReportingFreqWorkspaceModule {}
