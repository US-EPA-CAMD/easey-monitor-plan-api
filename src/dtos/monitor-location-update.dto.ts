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
  @ValidateNested({ each: true })
  @Type(() => MonitorAttributeBaseDTO)
  monitoringLocationAttribData: MonitorAttributeBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitCapacityBaseDTO)
  unitCapacityData: UnitCapacityBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitControlBaseDTO)
  unitControlData: UnitControlBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitFuelBaseDTO)
  unitFuelData: UnitFuelBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorMethodBaseDTO)
  monitoringMethodData: MonitorMethodBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => MatsMethodBaseDTO)
  supplementalMATSMonitoringMethodData: MatsMethodBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorFormulaBaseDTO)
  monitoringFormulaData: MonitorFormulaBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorDefaultBaseDTO)
  monitoringDefaultData: MonitorDefaultBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorSpanBaseDTO)
  monitoringSpanData: MonitorSpanBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => DuctWafBaseDTO)
  rectangularDuctWAFData: DuctWafBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => MonitorLoadBaseDTO)
  monitoringLoadData: MonitorLoadBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => UpdateComponentBaseDTO)
  componentData: UpdateComponentBaseDTO[];

  @ValidateNested({ each: true })
  @Type(() => UpdateMonitorSystemDTO)
  monitoringSystemData: UpdateMonitorSystemDTO[];

  @ValidateNested({ each: true })
  @Type(() => UpdateMonitorQualificationDTO)
  monitoringQualificationData: UpdateMonitorQualificationDTO[];
}
