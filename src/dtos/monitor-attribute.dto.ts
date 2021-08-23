import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitorAttributeDTO {
  id: string;
  locationId: string;
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
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
}
