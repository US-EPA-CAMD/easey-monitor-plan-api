import { In, IsNull } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MonitorPlanMap } from '../maps/monitor-plan.map';
import { MonitorPlanDTO } from '../dtos/monitor-plan.dto';
import { MonitorLocation } from '../entities/monitor-location.entity';

import { MonitorPlanRepository } from './monitor-plan.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MatsMethodRepository } from '../mats-method/mats-method.repository';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { MonitorFormulaRepository } from '../monitor-formula/monitor-formula.repository';
import { MonitorSpanRepository } from '../monitor-span/monitor-span.repository';
import { MonitorLoadRepository } from '../monitor-load/monitor-load.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

@Injectable()
export class MonitorPlanService {
  constructor(
    @InjectRepository(MonitorPlanRepository)
    private repository: MonitorPlanRepository,
    @InjectRepository(MonitorLocationRepository)
    private locationRepository: MonitorLocationRepository,
    @InjectRepository(MonitorMethodRepository)
    private methodRepository: MonitorMethodRepository,
    @InjectRepository(MatsMethodRepository)
    private matsMethodRepository: MatsMethodRepository,
    @InjectRepository(MonitorFormulaRepository)
    private formulaRepository: MonitorFormulaRepository,
    @InjectRepository(MonitorSpanRepository)
    private spanRepository: MonitorSpanRepository,
    @InjectRepository(MonitorLoadRepository)
    private loadRepository: MonitorLoadRepository,
    @InjectRepository(MonitorSystemRepository)
    private systemRepository: MonitorSystemRepository,
    private map: MonitorPlanMap,
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

  async getMonitorPlan(monPlanId: string): Promise<MonitorPlanDTO> {
    const mp = await this.repository.findOne({
      where: {
        id: monPlanId,
        endReportPeriodId: IsNull(),
      },
    });

    mp.locations = await this.locationRepository.getMonitorLocationsByPlanId(
      monPlanId,
    );

    // const monLocIds = mp.locations.map(i => i.id);
    // const methods = await this.methodRepository.find({
    //   where: { monLocId: In(monLocIds) },
    // });
    // const matsMethods = await this.matsMethodRepository.find({
    //   where: { monLocId: In(monLocIds) },
    // });
    // const formulas = await this.formulaRepository.find({
    //   where: { monLocId: In(monLocIds) },
    // });
    // const spans = await this.spanRepository.find({
    //   where: { monLocId: In(monLocIds) },
    // });
    // const loads = await this.loadRepository.find({
    //   where: { monLocId: In(monLocIds) },
    // });
    // const systems = await this.systemRepository.find({
    //   where: { monLocId: In(monLocIds) },
    // });

    // mp.locations.forEach(l => {
    //   const monLocId = l.id;
    //   l.methods = methods.filter(i => i.monLocId === monLocId);
    //   l.matsMethods = matsMethods.filter(i => i.monLocId === monLocId);
    //   l.formulas = formulas.filter(i => i.monLocId === monLocId);
    //   l.spans = spans.filter(i => i.monLocId === monLocId);
    //   l.loads = loads.filter(i => i.monLocId === monLocId);
    //   l.systems = systems.filter(i => i.monLocId === monLocId);
    // });

    await Promise.all(
      mp.locations.map(async l => {
        const monLocId = l.id;
        l.methods = await this.methodRepository.find({ monLocId });
        l.matsMethods = await this.matsMethodRepository.find({ monLocId });
        l.formulas = await this.formulaRepository.find({ monLocId });
        l.spans = await this.spanRepository.find({ monLocId });
        l.loads = await this.loadRepository.find({ monLocId });
        l.systems = await this.systemRepository.find({ monLocId });
      }),
    );

    return this.map.one(mp);
  }
}
