import { Injectable } from '@nestjs/common';

import { BaseMap } from './base.map';
import { UserCheckOut } from './../entities/workspace/user-check-out.entity';
import { UserCheckOutDTO } from 'src/dtos/user-check-out.dto';

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
