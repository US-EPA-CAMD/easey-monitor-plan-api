import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MonitorPlanReportingFrequencyMap } from '../maps/monitor-plan-reporting-freq.map';
import { MonitorPlanReportingFrequencyController } from './monitor-plan-reporting-freq.controller';
import { MonitorPlanReportingFrequencyRepository } from './monitor-plan-reporting-freq.repository';
import { MonitorPlanReportingFrequencyService } from './monitor-plan-reporting-freq.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanReportingFrequencyRepository]),
    HttpModule,
  ],
  controllers: [MonitorPlanReportingFrequencyController],
  providers: [
    MonitorPlanReportingFrequencyMap,
    MonitorPlanReportingFrequencyRepository,
    MonitorPlanReportingFrequencyService,
  ],
  exports: [
    TypeOrmModule,
    MonitorPlanReportingFrequencyMap,
    MonitorPlanReportingFrequencyRepository,
    MonitorPlanReportingFrequencyService,
  ],
})
export class MonitorPlanReportingFreqModule {}
