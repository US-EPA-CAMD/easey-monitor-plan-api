import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { UserCheckOut } from '../entities/workspace/user-check-out.entity';

@EntityRepository(UserCheckOut)
export class UserCheckOutRepository extends Repository<UserCheckOut> {
  async checkOutConfiguration(
    id: string,
    username: string,
  ): Promise<UserCheckOut> {
    try {
      await this.query(
        'SELECT * FROM camdecmpswks.check_out_monitor_plan($1, $2)',
        [id, username],
      );
      return this.findOne({ monPlanId: id });
    } catch (error) {
      throw new BadRequestException(error['message']);
    }
  }
}
