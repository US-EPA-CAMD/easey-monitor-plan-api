import { MonitorAttributeBaseDTO } from './monitor-attribute-base.dto';

export class UpdateMonitorAttributeDTO extends MonitorAttributeBaseDTO {
  ductIndicator: number;
  bypassIndicator: number;
  groundElevation: number;
  stackHeight: number;
  materialCode: string;
  shapeCode: string;
  crossAreaFlow: number;
  crossAreaStackExit: number;
  beginDate: Date;
  endDate: Date;
}
