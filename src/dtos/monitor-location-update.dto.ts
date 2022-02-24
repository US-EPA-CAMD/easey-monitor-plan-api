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
  attributes: UpdateMonitorAttributeDTO[];
  unitCapacity: UpdateUnitCapacityDTO[];
  unitControls: UpdateUnitControlDTO[];
  unitFuels: UpdateUnitFuelDTO[];
  methods: UpdateMonitorMethodDTO[];
  matsMethods: UpdateMatsMethodDTO[];
  formulas: UpdateMonitorFormulaDTO[];
  defaults: UpdateMonitorDefaultDTO[];
  spans: UpdateMonitorSpanDTO[];
  ductWafs: UpdateDuctWafDTO[];
  loads: UpdateMonitorLoadDTO[];

  @ValidateNested()
  @Type(() => UpdateComponentDTO)
  components: UpdateComponentDTO[];

  systems: UpdateMonitorSystemDTO[];
  qualifications: UpdateMonitorQualificationDTO[];
}
