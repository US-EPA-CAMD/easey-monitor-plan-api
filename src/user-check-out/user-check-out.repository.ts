import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { UserCheckOut } from '../entities/workspace/user-check-out.entity';

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
      throw new BadRequestException(error['message']);
    }
  }
}
