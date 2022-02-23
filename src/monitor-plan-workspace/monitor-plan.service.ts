import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MPEvaluationReportDTO } from '../dtos/mp-evaluation-report.dto';
import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { SystemFuelFlow } from 'src/entities/workspace/system-fuel-flow.entity';
import { SystemComponent } from '../entities/workspace/system-component.entity';
import { CountyCodeService } from '../county-code/county-code.service';
import { MonitorPlanReportResultService } from '../monitor-plan-report-result/monitor-plan-report-result.service';
import { MonitorPlanWorkspaceRepository } from './monitor-plan.repository';
import { MonitorLocationWorkspaceRepository } from '../monitor-location-workspace/monitor-location.repository';
import { MonitorPlanCommentWorkspaceRepository } from '../monitor-plan-comment-workspace/monitor-plan-comment.repository';
import { MonitorAttributeWorkspaceRepository } from '../monitor-attribute-workspace/monitor-attribute.repository';
import { MonitorMethodWorkspaceRepository } from '../monitor-method-workspace/monitor-method.repository';
import { MatsMethodWorkspaceRepository } from '../mats-method-workspace/mats-method.repository';
import { MonitorFormulaWorkspaceRepository } from '../monitor-formula-workspace/monitor-formula.repository';
import { MonitorDefaultWorkspaceRepository } from '../monitor-default-workspace/monitor-default.repository';
import { MonitorSpanWorkspaceRepository } from '../monitor-span-workspace/monitor-span.repository';
import { DuctWafWorkspaceRepository } from '../duct-waf-workspace/duct-waf.repository';
import { MonitorLoadWorkspaceRepository } from '../monitor-load-workspace/monitor-load.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system.repository';
import { UnitCapacityWorkspaceRepository } from '../unit-capacity-workspace/unit-capacity.repository';
import { MonitorQualificationWorkspaceRepository } from '../monitor-qualification-workspace/monitor-qualification.repository';
import { SystemFuelFlowWorkspaceRepository } from '../system-fuel-flow-workspace/system-fuel-flow.repository';
import { SystemComponentWorkspaceRepository } from '../system-component-workspace/system-component.repository';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { LEEQualificationWorkspaceRepository } from '../lee-qualification-workspace/lee-qualification.repository';
import { LMEQualificationWorkspaceRepository } from '../lme-qualification-workspace/lme-qualification.repository';
import { PCTQualificationWorkspaceRepository } from '../pct-qualification-workspace/pct-qualification.repository';

import { MonitorSystemMap } from 'src/maps/monitor-system.map';
import { UnitControlWorkspaceRepository } from 'src/unit-control-workspace/unit-control.repository';
import { UnitFuelWorkspaceRepository } from 'src/unit-fuel-workspace/unit-fuel.repository';

@Injectable()
export class MonitorPlanWorkspaceService {
  constructor(
    @InjectRepository(MonitorPlanWorkspaceRepository)
    private readonly repository: MonitorPlanWorkspaceRepository,
    @InjectRepository(MonitorLocationWorkspaceRepository)
    private readonly locationRepository: MonitorLocationWorkspaceRepository,
    @InjectRepository(MonitorPlanCommentWorkspaceRepository)
    private readonly commentRepository: MonitorPlanCommentWorkspaceRepository,
    @InjectRepository(MonitorAttributeWorkspaceRepository)
    private readonly attributeRepository: MonitorAttributeWorkspaceRepository,
    @InjectRepository(MonitorMethodWorkspaceRepository)
    private readonly methodRepository: MonitorMethodWorkspaceRepository,
    @InjectRepository(MatsMethodWorkspaceRepository)
    private readonly matsMethodRepository: MatsMethodWorkspaceRepository,
    @InjectRepository(MonitorFormulaWorkspaceRepository)
    private readonly formulaRepository: MonitorFormulaWorkspaceRepository,
    @InjectRepository(MonitorDefaultWorkspaceRepository)
    private readonly defaultRepository: MonitorDefaultWorkspaceRepository,
    @InjectRepository(MonitorSpanWorkspaceRepository)
    private readonly spanRepository: MonitorSpanWorkspaceRepository,
    @InjectRepository(DuctWafWorkspaceRepository)
    private readonly ductWafRepository: DuctWafWorkspaceRepository,
    @InjectRepository(MonitorLoadWorkspaceRepository)
    private readonly loadRepository: MonitorLoadWorkspaceRepository,
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly componentRepository: ComponentWorkspaceRepository,
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly systemRepository: MonitorSystemWorkspaceRepository,
    @InjectRepository(UnitCapacityWorkspaceRepository)
    private readonly unitCapacityRepository: UnitCapacityWorkspaceRepository,
    @InjectRepository(UnitControlWorkspaceRepository)
    private readonly unitControlRepository: UnitControlWorkspaceRepository,
    @InjectRepository(UnitFuelWorkspaceRepository)
    private readonly unitFuelRepository: UnitFuelWorkspaceRepository,
    @InjectRepository(MonitorQualificationWorkspaceRepository)
    private readonly qualificationRepository: MonitorQualificationWorkspaceRepository,
    @InjectRepository(SystemFuelFlowWorkspaceRepository)
    private readonly systemFuelFlowRepository: SystemFuelFlowWorkspaceRepository,
    @InjectRepository(SystemComponentWorkspaceRepository)
    private readonly systemComponentRepository: SystemComponentWorkspaceRepository,
    @InjectRepository(AnalyzerRangeWorkspaceRepository)
    private readonly analyzerRangeRepository: AnalyzerRangeWorkspaceRepository,
    @InjectRepository(LEEQualificationWorkspaceRepository)
    private readonly leeQualificationRepository: LEEQualificationWorkspaceRepository,
    @InjectRepository(LMEQualificationWorkspaceRepository)
    private readonly lmeQualificationRepository: LMEQualificationWorkspaceRepository,
    @InjectRepository(PCTQualificationWorkspaceRepository)
    private readonly pctQualificationRepository: PCTQualificationWorkspaceRepository,
    private readonly countyCodeService: CountyCodeService,
    private readonly mpReportResultService: MonitorPlanReportResultService,
    private map: MonitorPlanMap,
    private systemMap: MonitorSystemMap,
  ) {}

  async getConfigurations(orisCode: number): Promise<MonitorPlanDTO[]> {
    const plans = await this.repository.getMonitorPlansByOrisCode(orisCode);
    //TODO: error handling here in case no plans returned
    const locations = await this.locationRepository.getMonitorLocationsByFacId(
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
    const results = await this.map.many(plans);
    results.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name === b.name) {
        return 0;
      }

      return 1;
    });
    return results;
  }

  async revertToOfficialRecord(monPlanId: string): Promise<void> {
    return this.repository.revertToOfficialRecord(monPlanId);
  }

  async getMonitorPlan(monPlanId: string): Promise<MonitorPlanDTO> {
    const mp = await this.repository.getMonitorPlan(monPlanId);
    const mpDTO = new MonitorPlanDTO();
    mpDTO.id = mp.id;
    mpDTO.updateDate = mp.updateDate;
    mpDTO.userId = mp.userId;
    mpDTO.evalStatusCode = mp.evalStatusCode;
    mpDTO.facId = mp.facId;
    return mpDTO;
  }

  async updateDateAndUserId(monPlanId: string, userId: string): Promise<void> {
    return this.repository.updateDateAndUserId(monPlanId, userId);
  }

  async getEvaluationReport(planId: string) {
    const mpEvalReport: MPEvaluationReportDTO = new MPEvaluationReportDTO();

    const mp = await this.repository.getMonitorPlan(planId);

    const county = await this.countyCodeService.getCountyCode(
      mp.plant.countyCode,
    );

    const mpReportResults = await this.mpReportResultService.getMPReportResults(
      planId,
    );

    mpEvalReport.facilityName = mp.plant.name;
    mpEvalReport.facilityId = mp.plant.orisCode;
    mpEvalReport.state = county.stateCode;
    mpEvalReport.countyName = county.countyName;
    mpEvalReport.mpReportResults = mpReportResults;

    return mpEvalReport;
  }

  async resetToNeedsEvaluation(locId: string, userId: string): Promise<void> {
    const plan = await this.repository.getActivePlanByLocation(locId);
    const planId = plan.id;

    await this.repository.resetToNeedsEvaluation(planId, userId);
  }

  async exportMonitorPlan(planId: string): Promise<MonitorPlanDTO> {
    const mp = await this.repository.getMonitorPlan(planId);

    mp.locations = await this.locationRepository.getMonitorLocationsByPlanId(
      planId,
    );

    mp.comments = await this.commentRepository.find({
      monitorPlanId: planId,
    });

    const locationIds = mp.locations.map(l => l.id);

    const attributes = await this.attributeRepository.find({
      where: { locationId: In(locationIds) },
    });

    const methods = await this.methodRepository.find({
      where: { locationId: In(locationIds) },
    });

    const matsMethods = await this.matsMethodRepository.find({
      where: { locationId: In(locationIds) },
    });

    const formulas = await this.formulaRepository.find({
      where: { locationId: In(locationIds) },
    });

    const defaults = await this.defaultRepository.find({
      where: { locationId: In(locationIds) },
    });

    const spans = await this.spanRepository.find({
      where: { locationId: In(locationIds) },
    });

    const ductWafs = await this.ductWafRepository.find({
      where: { locationId: In(locationIds) },
    });

    const loads = await this.loadRepository.find({
      where: { locationId: In(locationIds) },
    });

    const components = await this.componentRepository.find({
      where: { locationId: In(locationIds) },
    });

    const systems = await this.systemRepository.find({
      where: { locationId: In(locationIds) },
    });

    const qualifications = await this.qualificationRepository.find({
      where: { locationId: In(locationIds) },
    });

    mp.locations.forEach(async l => {
      const locationId = l.id;
      l.attributes = attributes.filter(a => a.locationId === locationId);
      l.methods = methods.filter(m => m.locationId === locationId);
      l.matsMethods = matsMethods.filter(mm => mm.locationId === locationId);
      l.formulas = formulas.filter(f => f.locationId === locationId);
      l.defaults = defaults.filter(d => d.locationId === locationId);
      l.spans = spans.filter(s => s.locationId === locationId);
      l.ductWafs = ductWafs.filter(dw => dw.locationId === locationId);
      l.loads = loads.filter(l => l.locationId === locationId);
      l.components = components.filter(i => i.locationId === locationId);
      l.systems = systems.filter(s => s.locationId === locationId);
      l.qualifications = qualifications.filter(
        i => i.locationId === locationId,
      );

      l.unit.unitCapacities = await this.unitCapacityRepository.getUnitCapacities(
        l.id,
        l.unit.id,
      );

      l.unit.unitControls = await this.unitControlRepository.getUnitControls(
        l.id,
        l.unit.id,
      );

      l.unit.unitFuels = await this.unitFuelRepository.getUnitFuels(
        l.id,
        l.unit.id,
      );

      console.log('Entity', l.systems);

      const sysDTO = await this.systemMap.many(l.systems);
      console.log('Sys DTO', sysDTO);

      l.systems.forEach(async s => {
        s.fuelFlows = await this.systemFuelFlowRepository.getFuelFlows(s.id);
        s.components = await this.systemComponentRepository.getComponents(
          l.id,
          s.id,
        );
      });

      l.components.forEach(async c => {
        const componentId = c.id;
        c.analyzerRanges = await this.analyzerRangeRepository.find({
          componentRecordId: componentId,
        });
      });

      l.qualifications.forEach(async q => {
        const qualificationId = q.id;
        q.leeQualifications = await this.leeQualificationRepository.getLEEQualifications(
          l.id,
          qualificationId,
        );
        q.lmeQualifications = await this.lmeQualificationRepository.getLMEQualifications(
          l.id,
          qualificationId,
        );
        q.pctQualifications = await this.pctQualificationRepository.getPCTQualifications(
          l.id,
          qualificationId,
        );
      });
    });

    return this.map.one(mp);
  }
}
