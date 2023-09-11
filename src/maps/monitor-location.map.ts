import { Injectable } from '@nestjs/common';

import { MonitorLocation } from '../entities/monitor-location.entity';
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
    let stackPipeRecordId: string;
    let nonLoadBasedIndicator: number;
    let unitCapacityData = [];
    let unitControlData = [];
    let unitFuelData = [];

    const monitoringLocationAttribData = entity.monitoringLocationAttribData
      ? await this.attributeMap.many(entity.monitoringLocationAttribData)
      : [];
    const monitoringMethodData = entity.monitoringMethodData
      ? await this.methodMap.many(entity.monitoringMethodData)
      : [];
    const supplementalMATSMonitoringMethodData = entity.supplementalMATSMonitoringMethodData
      ? await this.matsMethodMap.many(
          entity.supplementalMATSMonitoringMethodData,
        )
      : [];
    const monitoringFormulaData = entity.monitoringFormulaData
      ? await this.formulaMap.many(entity.monitoringFormulaData)
      : [];
    const monitoringDefaultData = entity.monitoringDefaultData
      ? await this.defaultMap.many(entity.monitoringDefaultData)
      : [];
    const monitoringSpanData = entity.monitoringSpanData
      ? await this.spanMap.many(entity.monitoringSpanData)
      : [];
    const rectangularDuctWAFData = entity.rectangularDuctWAFData
      ? await this.ductWafMap.many(entity.rectangularDuctWAFData)
      : [];
    const monitoringLoadData = entity.monitoringLoadData
      ? await this.loadMap.many(entity.monitoringLoadData)
      : [];
    const componentData = entity.componentData
      ? await this.componentMap.many(entity.componentData)
      : [];
    const monitoringSystemData = entity.monitoringSystemData
      ? await this.systemMap.many(entity.monitoringSystemData)
      : [];
    const monitoringQualificationData = entity.monitoringQualificationData
      ? await this.qualificationMap.many(entity.monitoringQualificationData)
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

      if (entity.unit.unitCapacityData) {
        for (const capac of entity.unit.unitCapacityData) {
          capac.unit = entity.unit;
        }

        unitCapacityData = await this.unitCapacityMap.many(
          entity.unit.unitCapacityData,
        );
      } else {
        entity.unit.unitCapacityData = [];
      }

      unitControlData = entity.unit.unitControlData
        ? await this.unitControlMap.many(entity.unit.unitControlData)
        : [];
      unitFuelData = entity.unit.unitFuelData
        ? await this.unitFuelMap.many(entity.unit.unitFuelData)
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
