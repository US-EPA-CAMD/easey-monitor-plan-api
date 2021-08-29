import { MonitorFormulaBaseDTO } from './monitor-formula-base.dto';

export class MonitorFormulaDTO extends MonitorFormulaBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
