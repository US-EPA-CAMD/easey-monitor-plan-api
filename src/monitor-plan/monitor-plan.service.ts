import { In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { SystemFuelFlow } from '../entities/system-fuel-flow.entity';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorAttributeRepository } from '../monitor-attribute/monitor-attribute.repository';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { MatsMethodRepository } from '../mats-method/mats-method.repository';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorDefaultRepository } from '../monitor-default/monitor-default.repository';
import { MonitorSpanRepository } from '../monitor-span/monitor-span.repository';
import { DuctWafRepository } from '../duct-waf/duct-waf.repository';
import { MonitorLoadRepository } from '../monitor-load/monitor-load.repository';
//import { ComponentRepository } from '../component/component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { SystemFuelFlowRepository } from '../system-fuel-flow/system-fuel-flow.repository';
//import { MonitorQualificationRepository } from '../monitor-qualification/monitor-qualification.repository';

@Injectable()
export class MonitorPlanService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private readonly repository: MonitorPlanRepository,
    @InjectRepository(MonitorLocationRepository)
    private readonly locationRepository: MonitorLocationRepository,
    @InjectRepository(MonitorAttributeRepository)
    private readonly attributeRepository: MonitorAttributeRepository,
    @InjectRepository(MonitorMethodRepository)
    private readonly methodRepository: MonitorMethodRepository,
    @InjectRepository(MatsMethodRepository)
    private readonly matsMethodRepository: MatsMethodRepository,
    @InjectRepository(MonitorFormulaRepository)
    private readonly formulaRepository: MonitorFormulaRepository,
    @InjectRepository(MonitorDefaultRepository)
    private readonly defaultRepository: MonitorDefaultRepository,
    @InjectRepository(MonitorSpanRepository)
    private readonly spanRepository: MonitorSpanRepository,
    @InjectRepository(DuctWafRepository)
    private readonly ductWafRepository: DuctWafRepository,
    @InjectRepository(MonitorLoadRepository)
    private readonly loadRepository: MonitorLoadRepository,
    // @InjectRepository(ComponentRepository)
    // private readonly componentRepository: ComponentRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly systemRepository: MonitorSystemRepository,
    @InjectRepository(SystemFuelFlowRepository)
    private readonly systemFuelFlowRepository: SystemFuelFlowRepository,
    // @InjectRepository(MonitorQualificationRepository)
    // private readonly qualificationRepository: MonitorQualificationRepository,
    private readonly map: MonitorPlanMap,
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

  async getMonSystemFuelFlow(
    monSysId: string,
    monSysIds: string[],
  ): Promise<SystemFuelFlow[]> {
    const sysFuelFlows = await this.systemFuelFlowRepository.find({
      monitoringSystemRecordId: In(monSysIds),
    });
    return sysFuelFlows.filter(i => i.monitoringSystemRecordId === monSysId);
  }

  async getMonitorPlan(planId: string): Promise<MonitorPlanDTO> {
    const mp = await this.repository.getMonitorPlan(planId);
    mp.locations = await this.locationRepository.getMonitorLocationsByPlanId(
      planId,
    );

    const locationIds = mp.locations.map(i => i.id);
    //const units = mp.locations.filter(l => l.unit).map(l => l.unit);
    //const unitIds = units.map(u => u.id);

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
    // const components = await this.componentRepository.find({
    //   where: { locationId: In(locationIds) },
    // });
    const systems = await this.systemRepository.find({
      where: { locationId: In(locationIds) },
    });
    // const qualifications = await this.qualificationRepository.find({
    //   where: { locationId: In(locationIds) },
    // });

    mp.locations.forEach(l => {
      const locationId = l.id;
      l.attributes = attributes.filter(i => i.locationId === locationId);
      l.methods = methods.filter(i => i.locationId === locationId);
      l.matsMethods = matsMethods.filter(i => i.locationId === locationId);
      l.formulas = formulas.filter(i => i.locationId === locationId);
      l.defaults = defaults.filter(i => i.locationId === locationId);
      l.spans = spans.filter(i => i.locationId === locationId);
      l.ductWafs = ductWafs.filter(i => i.locationId === locationId);
      l.loads = loads.filter(i => i.locationId === locationId);
      //l.components = components.filter(i => i.locationId === locationId);
      l.systems = systems.filter(i => i.locationId === locationId);
      // l.qualifications = qualifications.filter(
      //   i => i.locationId === locationId,
      // );

      // const monSysIds = l.systems.map(sys => sys.id);
      // l.systems.forEach(async sys => {
      //   const monSysId = sys.id;
      //   sys.fuelFlows = await this.getMonSystemFuelFlow(monSysId, monSysIds);
      // });
    });

    return this.map.one(mp);
  }
}
