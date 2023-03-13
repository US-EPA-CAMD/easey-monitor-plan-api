import { MonitorLocationBaseDTO } from './monitor-location-base.dto';
import { MonitorAttributeBaseDTO } from './monitor-attribute.dto';
import { UnitCapacityBaseDTO } from './unit-capacity.dto';
import { UnitControlBaseDTO } from './unit-control.dto';
import { UnitFuelBaseDTO } from './unit-fuel.dto';
import { MonitorSpanBaseDTO } from './monitor-span.dto';
import { DuctWafBaseDTO } from './duct-waf.dto';
import { MonitorLoadBaseDTO } from './monitor-load.dto';
import { UpdateComponentBaseDTO } from './component.dto';
import { MonitorSystemBaseDTO } from './monitor-system.dto';
import { MonitorQualificationBaseDTO } from './monitor-qualification.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MonitorMethodBaseDTO } from './monitor-method.dto';
import { MatsMethodBaseDTO } from './mats-method.dto';
import { MonitorFormulaBaseDTO } from './monitor-formula.dto';
import { MonitorDefaultBaseDTO } from './monitor-default.dto';

export class UpdateMonitorLocationDTO extends MonitorLocationBaseDTO {
  @ValidateNested()
  @Type(() => MonitorAttributeBaseDTO)
  attributes: MonitorAttributeBaseDTO[];

  @ValidateNested()
  @Type(() => UnitCapacityBaseDTO)
  unitCapacities: UnitCapacityBaseDTO[];

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
  @Type(() => MonitorSpanBaseDTO)
  spans: MonitorSpanBaseDTO[];

  @ValidateNested()
  @Type(() => DuctWafBaseDTO)
  ductWafs: DuctWafBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorLoadBaseDTO)
  loads: MonitorLoadBaseDTO[];

  @ValidateNested()
  @Type(() => UpdateComponentBaseDTO)
  components: UpdateComponentBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorSystemBaseDTO)
  systems: MonitorSystemBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorQualificationBaseDTO)
  qualifications: MonitorQualificationBaseDTO[];

  @ValidateNested()
  @Type(() => MonitorSpanBaseDTO)
  spans: MonitorSpanBaseDTO[];
}
