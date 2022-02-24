import { Injectable } from '@nestjs/common';

import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorAttributeMap } from './montitor-attribute.map';
import { MonitorMethodMap } from '../maps/monitor-method.map';
import { MatsMethodMap } from '../maps/mats-method.map';
import { MonitorFormulaMap } from '../maps/monitor-formula.map';
import { MonitorDefaultMap } from './monitor-default.map';
import { MonitorSpanMap } from '../maps/monitor-span.map';
import { DuctWafMap } from './duct-waf.map';
import { MonitorLoadMap } from '../maps/monitor-load.map';
import { ComponentMap } from '../maps/component.map';
import { MonitorSystemMap } from '../maps/monitor-system.map';
import { MonitorQualificationMap } from '../maps/monitor-qualification.map';
import { UnitCapacityMap } from './unit-capacity.map';
import { UnitControlMap } from './unit-control.map';
import { UnitFuelMap } from './unit-fuel.map';

@Injectable()
export class MonitorLocationMap extends BaseMap<
  MonitorLocation,
  MonitorLocationDTO
> {
  constructor(
    private readonly attributeMap: MonitorAttributeMap,
    private readonly methodMap: MonitorMethodMap,
    private readonly matsMethodMap: MatsMethodMap,
    private readonly formulaMap: MonitorFormulaMap,
    private readonly defaultMap: MonitorDefaultMap,
    private readonly spanMap: MonitorSpanMap,
    private readonly ductWafMap: DuctWafMap,
    private readonly loadMap: MonitorLoadMap,
    private readonly componentMap: ComponentMap,
    private readonly systemMap: MonitorSystemMap,
    private readonly qualificationMap: MonitorQualificationMap,
    private readonly unitCapacityMap: UnitCapacityMap,
    private readonly unitControlMap: UnitControlMap,
    private readonly unitFuelMap: UnitFuelMap,
  ) {
    super();
  }

  private getStatus(entity: MonitorLocation): boolean {
    if (entity.unit) {
      const unitStatus = entity.unit.opStatuses[0];
      if (unitStatus.endDate == null && unitStatus.opStatusCode == 'RET') {
        return false;
      }
      return true;
    }

    if (entity.stackPipe) {
      if (entity.stackPipe.retireDate == null) {
        return true;
      }
    }

    return false;
  }

  public async one(entity: MonitorLocation): Promise<MonitorLocationDTO> {
    let name: string;
    let type: string;
    let unitId: string;
    let activeDate: Date;
    let retireDate: Date;
    let stackPipeId: string;
    let unitRecordId: number;
    let nonLoadBasedIndicator: number;
    let unitCapacities = [];
    let unitControls = [];
    let unitFuels = [];

    const attributes = entity.attributes
      ? await this.attributeMap.many(entity.attributes)
      : [];
    const methods = entity.methods
      ? await this.methodMap.many(entity.methods)
      : [];
    const matsMethods = entity.matsMethods
      ? await this.matsMethodMap.many(entity.matsMethods)
      : [];
    const formulas = entity.formulas
      ? await this.formulaMap.many(entity.formulas)
      : [];
    const defaults = entity.defaults
      ? await this.defaultMap.many(entity.defaults)
      : [];
    const spans = entity.spans
      ? await this.spanMap.many(entity.spans)
      : [];
    const ductWafs = entity.ductWafs
      ? await this.ductWafMap.many(entity.ductWafs)
      : [];
    const loads = entity.loads
      ? await this.loadMap.many(entity.loads)
      : [];
    const components = entity.components
      ? await this.componentMap.many(entity.components)
      : [];
    const systems = entity.systems
      ? await this.systemMap.many(entity.systems)
      : [];
    const qualifications = entity.qualifications
      ? await this.qualificationMap.many(entity.qualifications)
      : [];

    if (entity.unit) {
      type = 'unit';
      name = entity.unit.name;
      unitId = entity.unit.name;
      unitRecordId = entity.unit.id;
      nonLoadBasedIndicator = entity.unit.nonLoadBasedIndicator;
      stackPipeId = null;
      activeDate = null;
      retireDate = null;
      unitCapacities = entity.unit.unitCapacities
        ? await this.unitCapacityMap.many(entity.unit.unitCapacities)
        : [];
      unitControls = entity.unit.unitControls
        ? await this.unitControlMap.many(entity.unit.unitControls)
        : [];
      unitFuels = entity.unit.unitFuels
        ? await this.unitFuelMap.many(entity.unit.unitFuels)
        : [];
    }

    if (entity.stackPipe) {
      type = 'stack';
      name = entity.stackPipe.name;
      stackPipeId = entity.stackPipe.id;
      activeDate = entity.stackPipe.activeDate;
      retireDate = entity.stackPipe.retireDate;
      unitId = null;
      unitRecordId = null;
      nonLoadBasedIndicator = null;
    }

    return {
      id: entity.id,
      unitRecordId,
      unitId,
      stackPipeId,
      name,
      type,
      active: this.getStatus(entity),
      activeDate,
      retireDate,
      nonLoadBasedIndicator,
      attributes,
      unitCapacities,
      unitControls,
      unitFuels,
      methods,
      matsMethods,
      formulas,
      defaults,
      spans,
      ductWafs,
      loads,
      components,
      systems,
      qualifications,
    };
  }
}
