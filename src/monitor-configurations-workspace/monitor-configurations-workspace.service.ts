import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorPlanConfigurationDTO } from '../dtos/monitor-plan-configuration.dto';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorPlanWorkspaceRepository } from '../monitor-plan-workspace/monitor-plan.repository';
import { PlantWorkspaceRepository } from '../plant-workspace/plant.repository';
import { MonitorPlanConfigurationMap } from '../maps/monitor-plan-configuration.map';
import { EvalStatusCodeRepository } from './eval-status.repository';
import { SubmissionsAvailabilityStatusCodeRepository } from './submission-availability-status.repository';
import { UnitStackConfigurationWorkspaceRepository } from '../unit-stack-configuration-workspace/unit-stack-configuration.repository';

@Injectable()
export class MonitorConfigurationsWorkspaceService {
  constructor(
    private readonly map: MonitorPlanConfigurationMap,
    private readonly evalStatusCodeRepository: EvalStatusCodeRepository,
    private readonly submissionStatusCodeRepository: SubmissionsAvailabilityStatusCodeRepository,
    private readonly monitorLocationWorkspaceRepository: MonitorLocationWorkspaceRepository,
    private readonly monitorPlanWorkspaceRepository: MonitorPlanWorkspaceRepository,
    private readonly plantWorkspaceRepository: PlantWorkspaceRepository,
    private readonly uscWorkspaceRepository: UnitStackConfigurationWorkspaceRepository,
    private readonly entityManager: EntityManager,
  ) { }

  async getEvaluationQueuePosition(monPlanId: string): Promise<string> {
    const query = `
      WITH ord AS (
        SELECT  
            evs.evaluation_set_id, 
            evq.evaluation_id,
            evs.mon_plan_id,
            evq.test_sum_id,
            evq.qa_cert_event_id,
            evq.test_extension_exemption_id,
            evq.rpt_period_id,
            ROW_NUMBER() OVER (ORDER BY evs.queued_time) AS queue_position 
        FROM camdecmpsaux.EVALUATION_SET evs 
        JOIN camdecmpsaux.EVALUATION_QUEUE evq
            ON evq.evaluation_set_id = evs.evaluation_set_id 
            AND evq.status_cd = 'QUEUED'
        LEFT JOIN camdecmpswks.MONITOR_PLAN pln
            ON pln.mon_plan_id = evs.mon_plan_id 
        LEFT JOIN camdecmpswks.TEST_SUMMARY tst
            ON tst.test_sum_id = evq.test_sum_id
        LEFT JOIN camdecmpswks.QA_CERT_EVENT qce
            ON qce.qa_cert_event_id = evq.qa_cert_event_id
        LEFT JOIN camdecmpswks.TEST_EXTENSION_EXEMPTION tee
            ON tee.test_extension_exemption_id = evq.test_extension_exemption_id
        LEFT JOIN camdecmpswks.EMISSION_EVALUATION ems
            ON ems.mon_plan_id = evs.mon_plan_id
            AND ems.rpt_period_id = evq.rpt_period_id
        WHERE (
            evq.process_cd = 'MP' AND pln.eval_status_cd = 'INQ'
            OR
            evq.process_cd = 'QA' AND evq.test_sum_id IS NOT NULL AND tst.eval_status_cd = 'INQ'
            OR
            evq.process_cd = 'QA' AND evq.qa_cert_event_id IS NOT NULL AND qce.eval_status_cd = 'INQ'
            OR
            evq.process_cd = 'QA' AND evq.test_extension_exemption_id IS NOT NULL AND tee.eval_status_cd = 'INQ'
            OR
            evq.process_cd = 'EM' AND ems.eval_status_cd = 'INQ'
        )
      )
      SELECT * 
      FROM ord
      WHERE mon_plan_id = $1;
    `;

    const result = await this.entityManager.query(query, [monPlanId]);
    
    const queuePlace = result && result[0]?.queue_position ? `In Queue (# ${result[0]?.queue_position} in queue)`: "In Queue"
    return queuePlace;
  }


  async populateDescriptions(plan: MonitorPlanConfigurationDTO) {
    if (plan.evalStatusCode === 'INQ') {
      plan['evalStatusCodeDescription'] = await this.getEvaluationQueuePosition(plan.id)
    } else {
      plan['evalStatusCodeDescription'] = (
        await this.evalStatusCodeRepository.findOneBy({
          evalStatusCd: plan.evalStatusCode,
        })
      ).evalStatusCodeDescription;
    }

    plan['submissionAvailabilityCodeDescription'] = (
      await this.submissionStatusCodeRepository.findOneBy({
        subAvailabilityCode: plan.submissionAvailabilityCode,
      })
    ).subAvailabilityCodeDescription;
  }
  async populateLocationsAndStackConfigs(plan: MonitorPlan) {
    const [locations, unitStackConfigurations] = await Promise.all([
      this.monitorLocationWorkspaceRepository.getMonitorLocationsByPlanId(
        plan.id,
      ),
      this.uscWorkspaceRepository.getUnitStackConfigsByMonitorPlanId(plan.id),
    ]);
    plan.locations = locations;
    plan.unitStackConfigurations = unitStackConfigurations;
  }

  async getConfigurations(
    orisCodes: number[],
    monPlanIds: string[] = [],
  ): Promise<MonitorPlanDTO[]> {
    let plans: MonitorPlan[];
    const relations = {
      beginReportingPeriod: true,
      endReportingPeriod: true,
      plant: true,
    };
    if (monPlanIds.length > 0) {
      plans = await this.monitorPlanWorkspaceRepository.find({
        where: { id: In(monPlanIds) },
        relations,
      });
    } else {
      const plants = await this.plantWorkspaceRepository.find({
        where: { orisCode: In(orisCodes) },
      });
      plans = await this.monitorPlanWorkspaceRepository.find({
        where: { facId: In(plants.map(p => p.id)) },
        relations,
      });
    }

    await Promise.all(
      plans.map(async plan => this.populateLocationsAndStackConfigs(plan)),
    );

    const monPlanDto = await this.map.many(plans);

    await Promise.all(
      monPlanDto.map(async plan => await this.populateDescriptions(plan)),
    );

    monPlanDto.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name === b.name) {
        return 0;
      }

      return 1;
    });

    return monPlanDto;
  }
}
