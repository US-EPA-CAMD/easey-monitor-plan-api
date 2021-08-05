//import { LinkDTO } from './link.dto';
import { MatsMethodDTO } from './mats-method.dto';
import { MonitorMethodDTO } from './monitor-method.dto';
import { MonitorFormulaDTO } from './monitor-formula.dto';
//import { MonitorDefaultDTO } from './monitor-default.dto';
import { MonitorSpanDTO } from './monitor-span.dto';
import { MonitorLoadDTO } from './monitor-load.dto';
import { MonitorSystemDTO } from './monitor-system.dto';

export class MonitorLocationDTO {
  id: string;
  name: string;
  type: string;
  active: boolean;
  retireDate: Date;
  methods: MonitorMethodDTO[];
  matsMethods: MatsMethodDTO[];
  formulas: MonitorFormulaDTO[];
  //defaults: MonitorDefaultDTO[];
  spans: MonitorSpanDTO[];
  loads: MonitorLoadDTO[];
  systems: MonitorSystemDTO[];
  //links: LinkDTO[];
}
