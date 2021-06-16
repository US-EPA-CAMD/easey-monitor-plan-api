import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { UserCheckOut } from 'src/entities/user-check-out.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@EntityRepository(UserCheckOut)
export class UserCheckOutRepository extends Repository<UserCheckOut> {
  async getUserCheckOutByMonPlanId(id: string): Promise<UserCheckOut> {
    const record = await this.findOne({ monPlanId: id });

    if (!record) {
      throw new NotFoundException('Invalid Request');
    }

    return record;
  }

  async checkOutMonitorPlan(id: string, username: string) {
    try {
      const record = await this.query(
        'SELECT camdecmpswks.check_out_monitor_plan($1, $2)',
        [id, username],
      );

      return record;
    } catch (error) {
      throw new BadRequestException(error['message']);
    }
  }

  async updateCheckOutExpiration(
    id: string,
    newExp: Date,
  ): Promise<UpdateResult> {
    const updatedData = this.createQueryBuilder()
      .update(UserCheckOut)
      .set({
        expiration: newExp,
      })
      .where('monPlanId =:id', { id })
      .returning([
        'facId',
        'monPlanId',
        'checkedOutOn',
        'checkedOutBy',
        'expiration',
      ])
      .updateEntity(true)
      .execute();

    return updatedData;
  }
}
