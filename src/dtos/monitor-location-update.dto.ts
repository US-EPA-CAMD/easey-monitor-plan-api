import { MonitorLocationBaseDTO } from './monitor-location-base.dto';
import { MonitorAttributeBaseDTO } from './monitor-attribute.dto';
import { UnitCapacityBaseDTO } from './unit-capacity.dto';
import { UnitControlBaseDTO } from './unit-control.dto';
import { UnitFuelBaseDTO } from './unit-fuel.dto';
import { MonitorMethodBaseDTO } from './monitor-method.dto';
import { MatsMethodBaseDTO } from './mats-method.dto';
import { MonitorFormulaBaseDTO } from './monitor-formula.dto';
import { MonitorDefaultBaseDTO } from './monitor-default.dto';
import { UpdateMonitorSpanDTO } from './monitor-span-update.dto';
import { UpdateDuctWafDTO } from './duct-waf-update.dto';
import { UpdateMonitorLoadDTO } from './monitor-load-update.dto';
import { UpdateComponentDTO } from './component-update.dto';
import { UpdateMonitorSystemDTO } from './monitor-system-update.dto';
import { UpdateMonitorQualificationDTO } from './monitor-qualification-update.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMonitorLocationDTO extends MonitorLocationBaseDTO {
  @ValidateNested()
  @Type(() => MonitorAttributeBaseDTO)
  attributes: MonitorAttributeBaseDTO[];

  @ValidateNested()
  @Type(() => UnitCapacityBaseDTO)
  unitCapacity: UnitCapacityBaseDTO[];

  @ValidateNested()
  @Type(() => UnitControlBaseDTO)
  unitControls: UnitControlBaseDTO[];

  @ValidateNested()
  @Type(() => UnitFuelBaseDTO)
  unitFuels: UnitFuelBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorMethodBaseDTO)
  methods: MonitorMethodBaseDTO[];

  @ValidateNested()
  @Type(() => MatsMethodBaseDTO)
  matsMethods: MatsMethodBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorFormulaBaseDTO)
  formulas: MonitorFormulaBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorDefaultBaseDTO)
  defaults: MonitorDefaultBaseDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorSpanDTO)
  spans: UpdateMonitorSpanDTO[];

  @ValidateNested()
  @Type(() => UpdateDuctWafDTO)
  ductWafs: UpdateDuctWafDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorLoadDTO)
  loads: UpdateMonitorLoadDTO[];

  @ValidateNested()
  @Type(() => UpdateComponentDTO)
  components: UpdateComponentDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorSystemDTO)
  systems: UpdateMonitorSystemDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorQualificationDTO)
  qualifications: UpdateMonitorQualificationDTO[];
}
