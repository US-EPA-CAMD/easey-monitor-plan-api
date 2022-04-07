import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MonitorQualificationBaseDTO } from './monitor-qualification-base.dto';
import { UpdateLEEQualificationDTO } from './lee-qualification-update.dto';
import { UpdateLMEQualificationDTO } from './lme-qualification-update.dto';
import { UpdatePCTQualificationDTO } from './pct-qualification-update.dto';

export class UpdateMonitorQualificationDTO extends MonitorQualificationBaseDTO {
  @ValidateNested()
  @Type(() => UpdateLEEQualificationDTO)
  leeQualifications: UpdateLEEQualificationDTO[];

  @ValidateNested()
  @Type(() => UpdateLMEQualificationDTO)
  lmeQualifications: UpdateLMEQualificationDTO[];

  @ValidateNested()
  @Type(() => UpdatePCTQualificationDTO)
  pctQualifications: UpdatePCTQualificationDTO[];
}
