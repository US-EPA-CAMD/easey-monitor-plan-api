import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorPlanReportResultRepository } from './monitor-plan-report-result.repository';

@Injectable()
export class MonitorPlanReportResultService {
  constructor(
    @InjectRepository(MonitorPlanReportResultRepository)
    private readonly repository: MonitorPlanReportResultRepository,
  ) {}

  async getMPReportResults(planId: string) {
    return await this.repository.getMPReportResults(planId);
  }
}
