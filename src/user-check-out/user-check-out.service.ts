import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

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
    private readonly logger: Logger,
  ) {}

  async getCheckedOutConfigurations(): Promise<UserCheckOutDTO[]> {
    return this.repository.find();
  }

  async checkOutConfiguration(
    monPlanId: string,
    username: string,
  ): Promise<UserCheckOutDTO> {
    this.logger.info('Checked out location', {
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
      this.logger.error(
        NotFoundException,
        `Check-out configuration not found`,
        true,
        { monPlanId: monPlanId },
      );
    }

    return record;
  }

  async updateLastActivity(monPlanId: string): Promise<UserCheckOutDTO> {
    let record;
    try {
      record = await this.getCheckedOutConfiguration(monPlanId);
      record.lastActivity = new Date(Date.now());
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return this.repository.save(record);
  }

  async checkInConfiguration(monPlanId: string): Promise<Boolean> {
    let result;
    try {
      result = await this.repository.delete({ monPlanId });
    } catch (e) {
      this.logger.error(InternalServerErrorException, e.message, true);
    }

    return result.affected !== 0;
  }
}
