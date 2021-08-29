import { MonitorQualificationBaseDTO } from './monitor-qualification-base.dto';
import { LEEQualificationDTO } from './lee-qualification.dto';
import { LMEQualificationDTO } from './lme-qualification.dto';
import { PCTQualificationDTO } from './pct-qualification.dto';

export class MonitorQualificationDTO extends MonitorQualificationBaseDTO {
  id: string;
  locationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
  leeQualifications: LEEQualificationDTO[];
  lmeQualifications: LMEQualificationDTO[];
  pctQualifications: PCTQualificationDTO[];
}
