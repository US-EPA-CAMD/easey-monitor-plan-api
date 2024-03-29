import { Injectable } from '@nestjs/common';

import { MonitorLocation } from '../entities/monitor-location.entity';
import { MonitorLocation as WorkspaceMonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorLocationDTO } from '../dtos/monitor-location.dto';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { MonitorAttributeMap } from './monitor-attribute.map';
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
  MonitorLocation | WorkspaceMonitorLocation,
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

  private getStatus(
    entity: MonitorLocation | WorkspaceMonitorLocation,
  ): boolean {
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

  public async one(
    entity: MonitorLocation | WorkspaceMonitorLocation,
  ): Promise<MonitorLocationDTO> {
    let name: string;
    let type: string;
    let unitId: string;
    let activeDate: Date;
    let retireDate: Date;
    let stackPipeId: string;
    let unitRecordId: number;
    let stackPipeRecordId: string;
    let nonLoadBasedIndicator: number;
    let unitCapacityData = [];
    let unitControlData = [];
    let unitFuelData = [];

    const monitoringLocationAttribData = entity.attributes
      ? await this.attributeMap.many(entity.attributes)
      : [];
    const monitoringMethodData = entity.methods
      ? await this.methodMap.many(entity.methods)
      : [];
    const supplementalMATSMonitoringMethodData = entity.matsMethods
      ? await this.matsMethodMap.many(entity.matsMethods)
      : [];
    const monitoringFormulaData = entity.formulas
      ? await this.formulaMap.many(entity.formulas)
      : [];
    const monitoringDefaultData = entity.defaults
      ? await this.defaultMap.many(entity.defaults)
      : [];
    const monitoringSpanData = entity.spans
      ? await this.spanMap.many(entity.spans)
      : [];
    const rectangularDuctWAFData = entity.ductWafs
      ? await this.ductWafMap.many(entity.ductWafs)
      : [];
    const monitoringLoadData = entity.loads
      ? await this.loadMap.many(entity.loads)
      : [];
    const componentData = entity.components
      ? await this.componentMap.many(entity.components)
      : [];
    const monitoringSystemData = entity.systems
      ? await this.systemMap.many(entity.systems)
      : [];
    const monitoringQualificationData = entity.qualifications
      ? await this.qualificationMap.many(entity.qualifications)
      : [];

    if (entity.unit) {
      type = 'unit';
      name = entity.unit.name;
      unitId = entity.unit.name;
      unitRecordId = entity.unit.id;
      stackPipeRecordId = null;
      nonLoadBasedIndicator = entity.unit.nonLoadBasedIndicator;
      stackPipeId = null;
      activeDate = null;
      retireDate = null;

      if (entity.unit.unitCapacities) {
        for (const capac of entity.unit.unitCapacities) {
          capac.unit = entity.unit;
        }

        unitCapacityData = await this.unitCapacityMap.many(
          entity.unit.unitCapacities,
        );
      } else {
        entity.unit.unitCapacities = [];
      }

      unitControlData = entity.unit.unitControls
        ? await this.unitControlMap.many(entity.unit.unitControls)
        : [];
      unitFuelData = entity.unit.unitFuels
        ? await this.unitFuelMap.many(entity.unit.unitFuels)
        : [];
    }

    if (entity.stackPipe) {
      type = 'stack';
      name = entity.stackPipe.name;
      stackPipeRecordId = entity.stackPipe.id;
      stackPipeId = entity.stackPipe.name;
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
      stackPipeRecordId,
      stackPipeId,
      name,
      type,
      active: this.getStatus(entity),
      activeDate,
      retireDate,
      nonLoadBasedIndicator,
      monitoringLocationAttribData,
      unitCapacityData,
      unitControlData,
      unitFuelData,
      monitoringMethodData,
      supplementalMATSMonitoringMethodData,
      monitoringFormulaData,
      monitoringDefaultData,
      monitoringSpanData,
      rectangularDuctWAFData,
      monitoringLoadData,
      componentData,
      monitoringSystemData,
      monitoringQualificationData,
    };
  }
}
