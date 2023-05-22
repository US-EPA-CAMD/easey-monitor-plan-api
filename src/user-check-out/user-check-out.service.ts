import { InjectRepository } from '@nestjs/typeorm';
import {HttpStatus, Inject, Injectable} from '@nestjs/common';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutRepository } from './user-check-out.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import {UserCheckOutMap} from "../maps/user-check-out.map";

@Injectable()
export class UserCheckOutService {
  constructor(
    @InjectRepository(UserCheckOutRepository)
    private readonly repository: UserCheckOutRepository,
    @Inject(UserCheckOutMap)
    private readonly map: UserCheckOutMap,
  ) {}

  async getCheckedOutConfigurations(): Promise<UserCheckOutDTO[]> {
    const userCheckOuts = await this.repository.find();
    return this.map.many(userCheckOuts);
  }

  async checkOutConfiguration(
    monPlanId: string,
    username: string,
  ): Promise<UserCheckOutDTO> {
    const entity = await this.repository.checkOutConfiguration(monPlanId, username);
    return this.map.one(entity);
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

    return this.map.one(record);
  }

  async updateLastActivity(monPlanId: string): Promise<UserCheckOutDTO> {
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

    record.lastActivity = new Date(Date.now());
    await this.repository.save(record)

    return this.map.one(record);
  }

  async checkInConfiguration(monPlanId: string): Promise<Boolean> {
    const result = await this.repository.delete({ monPlanId });
    return result.affected !== 0;
  }
}
