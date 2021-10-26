import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutMap } from '../maps/user-check-out.map';
import { UserCheckOutRepository } from './user-check-out.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class UserCheckOutService {
  constructor(
    @InjectRepository(UserCheckOutRepository)
    private repository: UserCheckOutRepository,
    private map: UserCheckOutMap,
    private Logger: Logger,
  ) {}

  async getCheckedOutConfigurations(): Promise<UserCheckOutDTO[]> {
    return this.repository.find();
  }

  async checkOutConfiguration(
    monPlanId: string,
    username: string,
  ): Promise<UserCheckOutDTO> {
    this.Logger.info('Checked out location', {
      userId: username,
      monPlanId: monPlanId,
    });
    return this.repository.checkOutConfiguration(monPlanId, username);
  }

  async getCheckedOutConfiguration(
    monPlanId: string,
  ): Promise<UserCheckOutDTO> {
    const record = await this.repository.findOne({
      monPlanId,
    });

    if (!record) {
      this.Logger.error(
        NotFoundException,
        `Check-out configuration not found`,
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

  async checkInConfiguration(monPlanId: string): Promise<void> {
    const result = await this.repository.delete({ monPlanId });

    if (result.affected === 0) {
      this.Logger.error(NotFoundException, 'No record found to check in');
    }
  }
}
