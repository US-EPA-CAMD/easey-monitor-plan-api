import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { UserCheckOut } from './../entities/workspace/user-check-out.entity';
import { UserCheckOutBaseDTO } from '../dtos/user-check-out.dto';

@Injectable()
export class UserCheckOutMap extends BaseMap<
  UserCheckOut,
  UserCheckOutBaseDTO
> {
  public async one(entity: UserCheckOut): Promise<UserCheckOutBaseDTO> {
    return {
      facId: entity.facId,
      checkedOutBy: entity.checkedOutBy,
      checkedOutOn: entity.checkedOutOn,
      lastActivity: entity.lastActivity,
    };
  }
}
