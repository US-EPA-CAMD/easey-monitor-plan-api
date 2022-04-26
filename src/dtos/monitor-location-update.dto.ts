import { MonitorLocationBaseDTO } from './monitor-location-base.dto';
import { UpdateMonitorAttributeDTO } from './monitor-attribute-update.dto';
import { UpdateUnitCapacityDTO } from './unit-capacity-update.dto';
import { UpdateUnitControlDTO } from './unit-control-update.dto';
import { UpdateUnitFuelDTO } from './unit-fuel-update.dto';
import { UpdateMonitorMethodDTO } from './monitor-method-update.dto';
import { UpdateMatsMethodDTO } from './mats-method-update.dto';
import { UpdateMonitorFormulaDTO } from './monitor-formula-update.dto';
import { UpdateMonitorDefaultDTO } from './monitor-default-update.dto';
import { UpdateMonitorSpanDTO } from './monitor-span-update.dto';
import { DuctWafBaseDTO } from './duct-waf.dto';
import { MonitorLoadBaseDTO } from './monitor-load.dto';
import { UpdateComponentBaseDTO } from './component.dto';
import { MonitorSystemBaseDTO } from './monitor-system.dto';
import { MonitorQualificationBaseDTO } from './monitor-qualification.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMonitorLocationDTO extends MonitorLocationBaseDTO {
  @ValidateNested()
  @Type(() => UpdateMonitorAttributeDTO)
  attributes: UpdateMonitorAttributeDTO[];

  @ValidateNested()
  @Type(() => UpdateUnitCapacityDTO)
  unitCapacity: UpdateUnitCapacityDTO[];

  @ValidateNested()
  @Type(() => UpdateUnitControlDTO)
  unitControls: UpdateUnitControlDTO[];

  @ValidateNested()
  @Type(() => UpdateUnitFuelDTO)
  unitFuels: UpdateUnitFuelDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorMethodDTO)
  methods: UpdateMonitorMethodDTO[];

  @ValidateNested()
  @Type(() => UpdateMatsMethodDTO)
  matsMethods: UpdateMatsMethodDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorFormulaDTO)
  formulas: UpdateMonitorFormulaDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorDefaultDTO)
  defaults: UpdateMonitorDefaultDTO[];

  @ValidateNested()
  @Type(() => UpdateMonitorSpanDTO)
  spans: UpdateMonitorSpanDTO[];

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
}
