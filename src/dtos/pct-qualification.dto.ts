import { PCTQualificationBaseDTO } from './pct-qualification-base.dto';

export class PCTQualificationDTO extends PCTQualificationBaseDTO {
  id: string;
  qualificationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
}
