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
import { UpdateDuctWafDTO } from './duct-waf-update.dto';
import { UpdateMonitorLoadDTO } from './monitor-load-update.dto';
import { UpdateComponentDTO } from './component-update.dto';
import { UpdateMonitorSystemDTO } from './monitor-system-update.dto';
import { UpdateMonitorQualificationDTO } from './monitor-qualification-update.dto';
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
