import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UserCheckOut } from '../entities/workspace/user-check-out.entity';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class UserCheckOutRepository extends Repository<UserCheckOut> {
  constructor(entityManager: EntityManager) {
    super(UserCheckOut, entityManager);
  }

  async checkOutConfiguration(
    id: string,
    username: string,
  ): Promise<UserCheckOut> {
    try {
      await this.query(
        'SELECT * FROM camdecmpswks.check_out_monitor_plan($1, $2)',
        [id, username],
      );
      return this.findOneBy({ monPlanId: id });
    } catch (error) {
      throw new EaseyException(new Error(error?.message), HttpStatus.BAD_REQUEST);
    }
  }
}
