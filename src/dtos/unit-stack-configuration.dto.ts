import { UnitStackConfigurationBaseDTO } from './unit-stack-configuration-base.dto';

export class UnitStackConfigurationDTO extends UnitStackConfigurationBaseDTO {
  id: string;
  userId: string;
  addDate: Date;
  updateDate: Date;
  active: boolean;
  stackName: string;
}
