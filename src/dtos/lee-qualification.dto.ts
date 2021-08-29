import { LEEQualificationBaseDTO } from './lee-qualification-base.dto';

export class LEEQualificationDTO extends LEEQualificationBaseDTO {
  id: string;
  qualificationId: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
}
