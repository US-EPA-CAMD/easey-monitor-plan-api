import { MonitorLocationBaseDTO } from './monitor-location-base.dto';
import { MonitorAttributeDTO } from './monitor-attribute.dto';
import { UnitCapacityDTO } from './unit-capacity.dto';
import { UnitControlDTO } from './unit-control.dto';
import { UnitFuelDTO } from './unit-fuel.dto';
import { MonitorMethodDTO } from './monitor-method.dto';
import { MatsMethodDTO } from './mats-method.dto';
import { MonitorFormulaDTO } from './monitor-formula.dto';
import { MonitorDefaultDTO } from './monitor-default.dto';
import { MonitorSpanDTO } from './monitor-span.dto';
import { DuctWafDTO } from './duct-waf.dto';
import { MonitorLoadDTO } from './monitor-load.dto';
import { ComponentDTO } from './component.dto';
import { MonitorSystemDTO } from './monitor-system.dto';
import { MonitorQualificationDTO } from './monitor-qualification.dto';

export class MonitorLocationDTO extends MonitorLocationBaseDTO {
  id: string;
  unitRecordId: number;
  name: string;
  type: string;
  active: boolean;
  attributes: MonitorAttributeDTO[];
  unitCapacity: UnitCapacityDTO[];
  unitControls: UnitControlDTO[];
  unitFuels: UnitFuelDTO[];
  methods: MonitorMethodDTO[];
  matsMethods: MatsMethodDTO[];
  formulas: MonitorFormulaDTO[];
  defaults: MonitorDefaultDTO[];
  spans: MonitorSpanDTO[];
  ductWafs: DuctWafDTO[];
  loads: MonitorLoadDTO[];
  components: ComponentDTO[];
  systems: MonitorSystemDTO[];
  qualifications: MonitorQualificationDTO[];
}
