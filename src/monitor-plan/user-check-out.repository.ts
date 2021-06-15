import { EntityRepository, Repository } from 'typeorm';
import { UserCheckOut } from 'src/entities/user-check-out.entity';

@EntityRepository(UserCheckOut)
export class UserCheckOutRepository extends Repository<UserCheckOut> {
  async getUserCheckOut(id: string): Promise<UserCheckOut> {
    const result = await this.findOne({ monPlanId: id });
    console.log('result ', result);

    return result;
  }
}
