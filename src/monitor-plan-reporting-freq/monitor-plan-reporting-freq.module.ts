import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorPlanReportingFrequencyMap } from '../maps/monitor-plan-reporting-freq.map';
import { MonitorPlanReportingFrequencyRepository } from './monitor-plan-reporting-freq.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorPlanReportingFrequencyRepository]),
  ],
  controllers: [],
  providers: [MonitorPlanReportingFrequencyMap],
  exports: [TypeOrmModule, MonitorPlanReportingFrequencyMap],
})
export class MonitorPlanReportingFreqModule {}
