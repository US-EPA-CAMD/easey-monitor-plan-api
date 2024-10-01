import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { EntityManager } from 'typeorm';

import { UserCheckOutDTO } from '../dtos/user-check-out.dto';
import { UserCheckOutMap } from '../maps/user-check-out.map';
import { withTransaction } from '../utils';
import { UserCheckOutRepository } from './user-check-out.repository';

@Injectable()
export class UserCheckOutService {
  constructor(
    private readonly entityManager: EntityManager,
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
    if (!(await this.ensureNoEvaluationOrSubmissionInProgress(monPlanId))) {
      throw new EaseyException(
        new Error(
          'Record can not be checked out. It is currently being evaluated or submitted.',
        ),
        HttpStatus.NOT_FOUND,
        { monPlanId: monPlanId },
      );
    }

    const entity = await this.repository.checkOutConfiguration(
      monPlanId,
      username,
    );
    return this.map.one(entity);
  }

  async getCheckedOutConfiguration(
    monPlanId: string,
  ): Promise<UserCheckOutDTO> {
    const record = await this.repository.findOneBy({
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

  private async ensureNoEvaluationOrSubmissionInProgress(
    monPlanId: string,
    trx?: EntityManager,
  ) {
    const evalRecordsInProgress = await (trx ?? this.returnManager()).query(
      `SELECT * FROM CAMDECMPSAUX.evaluation_set es
      JOIN CAMDECMPSAUX.evaluation_queue eq USING(evaluation_set_id)
      WHERE mon_plan_id = $1 AND status_cd NOT IN ('COMPLETE', 'ERROR');
      `,
      [monPlanId],
    );

    const submissionRecordsInProgress = await (
      trx ?? this.returnManager()
    ).query(
      `SELECT * FROM CAMDECMPSAUX.submission_set
       WHERE mon_plan_id = $1 AND status_cd NOT IN ('COMPLETE', 'ERROR');
      `,
      [monPlanId],
    );

    if (
      (evalRecordsInProgress && evalRecordsInProgress.length > 0) ||
      (submissionRecordsInProgress && submissionRecordsInProgress.length > 0)
    ) {
      return false;
    }
    return true;
  }

  async updateLastActivity(monPlanId: string): Promise<UserCheckOutDTO> {
    const record = await this.repository.findOneBy({
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
    return this.entityManager;
  };

  async checkInConfiguration(
    monPlanId: string,
    trx?: EntityManager,
  ): Promise<Boolean> {
    if (
      !(await this.ensureNoEvaluationOrSubmissionInProgress(monPlanId, trx))
    ) {
      throw new EaseyException(
        new Error(
          'Record can not be checked in. It is currently being evaluated or submitted.',
        ),
        HttpStatus.NOT_FOUND,
        { monPlanId: monPlanId },
      );
    }

    const result = await withTransaction(this.repository, trx).delete({
      monPlanId,
    });
    return result.affected !== 0;
  }
}
