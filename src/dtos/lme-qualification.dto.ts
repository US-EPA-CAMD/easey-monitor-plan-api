import { LMEQualificationBaseDTO } from './lme-qualification-base.dto';

export class LMEQualificationDTO extends LMEQualificationBaseDTO {
  id: string;
  qualificationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
}
