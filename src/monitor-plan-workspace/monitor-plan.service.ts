import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';

import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { CountyCodeService } from '../county-code/county-code.service';
import { MonitorPlanReportResultService } from '../monitor-plan-report-result/monitor-plan-report-result.service';
import { MPEvaluationReportDTO } from '../dtos/mp-evaluation-report.dto';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class MonitorPlanWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanWorkspaceRepository)
    private repository: MonitorPlanWorkspaceRepository,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private mlRepository: MonitorLocationWorkspaceRepository,
    private readonly countyCodeService: CountyCodeService,
    private readonly mpReportResultService: MonitorPlanReportResultService,
    private map: MonitorPlanMap,
    private readonly logger: Logger,
  ) {}

  async getConfigurations(orisCode: number): Promise<MonitorPlanDTO[]> {
    let results;
    try {
      const plans = await this.repository.getMonitorPlansByOrisCode(orisCode);
      //TODO: error handling here in case no plans returned
      const locations = await this.mlRepository.getMonitorLocationsByFacId(
        plans[0].facId,
      );
      plans.forEach(p => {
        const matchedLocations: MonitorLocation[] = [];
        locations.forEach(l => {
          const planIds = l.plans.map(lp => lp.id);
          if (planIds.includes(p.id)) {
            matchedLocations.push(l);
          }
        });
        p.locations = matchedLocations;
      });
      results = await this.map.many(plans);
      results.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }

        if (a.name === b.name) {
          return 0;
        }

        return 1;
      });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return results;
  }

  async revertToOfficialRecord(monPlanId: string): Promise<void> {
    let result;
    try {
      result = await this.repository.revertToOfficialRecord(monPlanId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return result;
  }

  async getMonitorPlan(monPlanId: string): Promise<MonitorPlanDTO> {
    let mpDTO;
    try {
      const mp = await this.repository.getMonitorPlan(monPlanId);

      console.log(mp);
      mpDTO = new MonitorPlanDTO();
      mpDTO.id = mp.id;
      mpDTO.updateDate = mp.updateDate;
      mpDTO.userId = mp.userId;
      mpDTO.evalStatusCode = mp.evalStatusCode;
      mpDTO.facId = mp.facId;
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
    return mpDTO;
  }

  async updateDateAndUserId(monPlanId: string, userId: string): Promise<void> {
    let result;
    try {
      result = await this.repository.updateDateAndUserId(monPlanId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return result;
  }

  async getEvaluationReport(planId: string) {
    let mpEvalReport: MPEvaluationReportDTO = new MPEvaluationReportDTO();
    try {
      const mp = await this.repository.getMonitorPlan(planId);

      const county = await this.countyCodeService.getCountyCode(
        mp.plant.countyCode,
      );

      const mpReportResults = await this.mpReportResultService.getMPReportResults(
        planId,
      );

      mpEvalReport.facilityName = mp.plant.name;
      mpEvalReport.facilityId = mp.facId;
      mpEvalReport.state = county.stateCode;
      mpEvalReport.countyName = county.countyName;
      mpEvalReport.mpReportResults = mpReportResults;
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return mpEvalReport;
  }

  async resetToNeedsEvaluation(locId: string, userId: string): Promise<void> {
    let result;
    try {
      const plan = await this.repository.getActivePlanByLocation(locId);
      const planId = plan.id;
      await this.repository.resetToNeedsEvaluation(planId, userId);
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }
  }
}
