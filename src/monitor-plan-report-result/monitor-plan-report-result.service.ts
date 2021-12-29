import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorPlanReportResultRepository } from './monitor-plan-report-result.repository';

@Injectable()
export class MonitorPlanReportResultService {
  constructor(
    @InjectRepository(MonitorPlanReportResultRepository)
    private readonly repository: MonitorPlanReportResultRepository,
    private readonly logger: Logger,
  ) {}

  async getMPReportResults(planId: string) {
    let result;
    try {
      result = await this.repository.getMPReportResults(planId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return result;
  }
}
