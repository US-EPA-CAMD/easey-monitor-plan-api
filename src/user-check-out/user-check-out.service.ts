import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutRepository } from './user-check-out.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class UserCheckOutService {
  constructor(
    @InjectRepository(UserCheckOutRepository)
    private readonly repository: UserCheckOutRepository,
  ) {}

  async getCheckedOutConfigurations(): Promise<UserCheckOutDTO[]> {
    return this.repository.find();
  }

  async checkOutConfiguration(
    monPlanId: string,
    username: string,
  ): Promise<UserCheckOutDTO> {
    return this.repository.checkOutConfiguration(monPlanId, username);
  }

  async getCheckedOutConfiguration(
    monPlanId: string,
  ): Promise<UserCheckOutDTO> {
    const record = await this.repository.findOne({
      monPlanId,
    });

    if (!record) {
      throw new LoggingException(
        'Check-out configuration not found',
        HttpStatus.NOT_FOUND,
        { monPlanId: monPlanId },
      );
    }

    return record;
  }

  async updateLastActivity(monPlanId: string): Promise<UserCheckOutDTO> {
    const record = await this.getCheckedOutConfiguration(monPlanId);
    record.lastActivity = new Date(Date.now());
    return this.repository.save(record);
  }

  async checkInConfiguration(monPlanId: string): Promise<Boolean> {
    const result = await this.repository.delete({ monPlanId });
    return result.affected !== 0;
  }
}
