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

  async checkOutMonitorPlan(
    id: string,
    username: string,
  ): Promise<UserCheckOut> {
    try {
      await this.query('SELECT camdecmpswks.check_out_monitor_plan($1, $2)', [
        id,
        username,
      ]);

      return await this.getUserCheckOutByMonPlanId(id);
    } catch (error) {
      throw new BadRequestException(error['message']);
    }
  }

  async updateLockActivity(id: string): Promise<UpdateResult> {
    const updatedData = await this.createQueryBuilder()
      .update(UserCheckOut)
      .set({
        lastActivity: new Date(Date.now()),
      })
      .where('monPlanId =:id', { id })
      .returning([
        'facId',
        'monPlanId',
        'checkedOutOn',
        'checkedOutBy',
        'lastActivity',
      ])
      .updateEntity(true)
      .execute();

    return updatedData;
  }
}
