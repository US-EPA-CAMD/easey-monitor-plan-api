import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutRepository } from './user-check-out.repository';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { UserCheckOutMap } from '../maps/user-check-out.map';
import { getManager } from 'typeorm';

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
    const entity = await this.repository.checkOutConfiguration(
      monPlanId,
      username,
    );
    return this.map.one(entity);
  }

  async getCheckedOutConfiguration(
    monPlanId: string,
  ): Promise<UserCheckOutDTO> {
    const record = await this.repository.findOne({
      monPlanId,
    });

    if (!record) {
      throw new EaseyException(
        new Error('Check-out configuration not found'),
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
      throw new EaseyException(
        new Error('Check-out configuration not found'),
        HttpStatus.NOT_FOUND,
        { monPlanId: monPlanId },
      );
    }

    record.lastActivity = new Date(Date.now());
    await this.repository.save(record);

    return this.map.one(record);
  }

  returnManager = () => {
    return getManager();
  };

  async checkInConfiguration(monPlanId: string): Promise<Boolean> {
    const evalRecordsInProgress = await this.returnManager().query(
      `SELECT * FROM CAMDECMPSAUX.evaluation_set es
      JOIN CAMDECMPSAUX.evaluation_queue eq USING(evaluation_set_id)
      WHERE mon_plan_id = $1 AND status_cd NOT IN ('COMPLETE', 'ERROR');
      `,
      [monPlanId],
    );

    const submissionRecordsInProgress = await this.returnManager().query(
      `SELECT * FROM CAMDECMPSAUX.submission_set
       WHERE mon_plan_id = $1 AND status_cd NOT IN ('COMPLETE', 'ERROR');
      `,
      [monPlanId],
    );

    if (
      (evalRecordsInProgress && evalRecordsInProgress.length > 0) ||
      (submissionRecordsInProgress && submissionRecordsInProgress.length > 0)
    ) {
      throw new EaseyException(
        new Error(
          'Record can not be checked in. It is currently being evaluated or submitted.',
        ),
        HttpStatus.NOT_FOUND,
        { monPlanId: monPlanId },
      );
    }

    const result = await this.repository.delete({ monPlanId });
    return result.affected !== 0;
  }
}
