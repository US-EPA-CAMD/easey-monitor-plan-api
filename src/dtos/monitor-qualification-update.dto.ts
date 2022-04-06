import { MonitorQualificationBaseDTO } from './monitor-qualification-base.dto';
import { UpdateLEEQualificationDTO } from './lee-qualification-update.dto';
import { UpdateLMEQualificationDTO } from './lme-qualification-update.dto';
import { UpdatePCTQualificationDTO } from './pct-qualification-update.dto';

export class UpdateMonitorQualificationDTO extends MonitorQualificationBaseDTO {
  leeQualifications: UpdateLEEQualificationDTO[];
  lmeQualifications: UpdateLMEQualificationDTO[];
  pctQualifications: UpdatePCTQualificationDTO[];
}
