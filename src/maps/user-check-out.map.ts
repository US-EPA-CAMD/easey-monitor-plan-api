import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UserCheckOut } from './../entities/workspace/user-check-out.entity';
import { UserCheckOutDTO } from '../dtos/user-check-out.dto';

@Injectable()
export class UserCheckOutMap extends BaseMap<UserCheckOut, UserCheckOutDTO> {
  public async one(entity: UserCheckOut): Promise<UserCheckOutDTO> {
    return {
      facId: entity.facId,
      monPlanId: entity.monPlanId,
      checkedOutBy: entity.checkedOutBy,
      checkedOutOn: entity.checkedOutOn,
      lastActivity: entity.lastActivity,
    };
  }
}
