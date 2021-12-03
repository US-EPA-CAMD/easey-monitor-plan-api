import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorPlanReportResultRepository } from './monitor-plan-report-result.repository';
import { MonitorPlanReportResultService } from './monitor-plan-report-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorPlanReportResultRepository])],
  controllers: [],
  providers: [MonitorPlanReportResultService],
  exports: [TypeOrmModule, MonitorPlanReportResultService],
})
export class MonitorQualificationModule {}
