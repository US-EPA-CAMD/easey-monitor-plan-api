import { MonitorAttributeDTO } from './monitor-attribute.dto';
import { MatsMethodDTO } from './mats-method.dto';
import { MonitorMethodDTO } from './monitor-method.dto';
import { MonitorFormulaDTO } from './monitor-formula.dto';
import { MonitorDefaultDTO } from './monitor-default.dto';
import { MonitorSpanDTO } from './monitor-span.dto';
import { MonitorLoadDTO } from './monitor-load.dto';
import { MonitorSystemDTO } from './monitor-system.dto';
import { DuctWafDTO } from './duct-waf.dto';
import { UnitCapacityDTO } from './unit-capacity.dto';

export class MonitorLocationDTO {
  id: string;
  name: string;
  type: string;
  active: boolean;
  retireDate: Date;
  attributes: MonitorAttributeDTO[];
  unitCapacity: UnitCapacityDTO[];
  methods: MonitorMethodDTO[];
  matsMethods: MatsMethodDTO[];
  formulas: MonitorFormulaDTO[];
  defaults: MonitorDefaultDTO[];
  spans: MonitorSpanDTO[];
  loads: MonitorLoadDTO[];
  systems: MonitorSystemDTO[];
  ductWafs: DuctWafDTO[];
}
