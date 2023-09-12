import { MonitorLocationBaseDTO } from './monitor-location-base.dto';
import { MonitorAttributeBaseDTO } from './monitor-attribute.dto';
import { UnitCapacityBaseDTO } from './unit-capacity.dto';
import { UnitControlBaseDTO } from './unit-control.dto';
import { UnitFuelBaseDTO } from './unit-fuel.dto';
import { MonitorSpanBaseDTO } from './monitor-span.dto';
import { DuctWafBaseDTO } from './duct-waf.dto';
import { MonitorLoadBaseDTO } from './monitor-load.dto';
import { UpdateComponentBaseDTO } from './component.dto';
import { UpdateMonitorSystemDTO } from './monitor-system.dto';
import {
  MonitorQualificationBaseDTO,
  UpdateMonitorQualificationDTO,
} from './monitor-qualification.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MonitorMethodBaseDTO } from './monitor-method.dto';
import { MatsMethodBaseDTO } from './mats-method.dto';
import { MonitorFormulaBaseDTO } from './monitor-formula.dto';
import { MonitorDefaultBaseDTO } from './monitor-default.dto';

export class UpdateMonitorLocationDTO extends MonitorLocationBaseDTO {
  @ValidateNested()
  @Type(() => MonitorAttributeBaseDTO)
  monitoringLocationAttribData: MonitorAttributeBaseDTO[];

  @ValidateNested()
  @Type(() => UnitCapacityBaseDTO)
  unitCapacityData: UnitCapacityBaseDTO[];

  @ValidateNested()
  @Type(() => UnitControlBaseDTO)
  unitControlData: UnitControlBaseDTO[];

  @ValidateNested()
  @Type(() => UnitFuelBaseDTO)
  unitFuelData: UnitFuelBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorMethodBaseDTO)
  monitoringMethodData: MonitorMethodBaseDTO[];

  @ValidateNested()
  @Type(() => MatsMethodBaseDTO)
  supplementalMATSMonitoringMethodData: MatsMethodBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorFormulaBaseDTO)
  monitoringFormulaData: MonitorFormulaBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorDefaultBaseDTO)
  monitoringDefaultData: MonitorDefaultBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorSpanBaseDTO)
  monitoringSpanData: MonitorSpanBaseDTO[];

  @ValidateNested()
  @Type(() => DuctWafBaseDTO)
  rectangularDuctWAFData: DuctWafBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorLoadBaseDTO)
  monitoringLoadData: MonitorLoadBaseDTO[];

  @ValidateNested()
  @Type(() => UpdateComponentBaseDTO)
  componentData: UpdateComponentBaseDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorSystemDTO)
  monitoringSystemData: UpdateMonitorSystemDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorQualificationDTO)
  monitoringQualificationData: UpdateMonitorQualificationDTO[];
}
