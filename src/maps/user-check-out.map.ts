import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UserCheckOut } from './../entities/workspace/user-check-out.entity';
import { UserCheckOutDTO } from '../dtos/user-check-out.dto';

@Injectable()
export class UserCheckOutMap extends BaseMap<
  UserCheckOut,
  UserCheckOutDTO
> {
  public async one(entity: UserCheckOut): Promise<UserCheckOutDTO> {
    return {
      monPlanId: entity.monPlanId,
      facId: entity.facId,
      checkedOutBy: entity.checkedOutBy,
      checkedOutOn: entity.checkedOutOn?.toISOString() ?? null,
      lastActivity: entity.lastActivity?.toISOString() ?? null,
    };
  }
}
