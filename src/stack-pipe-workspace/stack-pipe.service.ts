import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorLocationBaseDTO } from '../dtos/monitor-location-base.dto';
import { UpdateMonitorLocationDTO } from '../dtos/monitor-location-update.dto';
import { StackPipeBaseDTO } from '../dtos/stack-pipe.dto';
import { EmissionEvaluationService } from '../emission-evaluation/emission-evaluation.service';
import { MonitorLocation as MonitorLocationWorkspace } from '../entities/workspace/monitor-location.entity';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { StackPipeMap } from '../maps/stack-pipe.map';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';
import { withTransaction } from '../utils';
import { StackPipeWorkspaceRepository } from './stack-pipe.repository';

@Injectable()
export class StackPipeWorkspaceService {
  constructor(
    private readonly emissionEvaluationService: EmissionEvaluationService,
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
    private readonly map: StackPipeMap,
    @Inject(forwardRef(() => MonitorLocationWorkspaceService))
    private readonly monitorLocationWorkspaceService: MonitorLocationWorkspaceService,
    private readonly repository: StackPipeWorkspaceRepository,
  ) {
    this.logger.setContext('StackPipeWorkspaceService');
  }

  async createStackPipeRecord(
    loc: MonitorLocationBaseDTO | StackPipeBaseDTO,
    facId: number,
    userId: string,
    trx?: EntityManager,
  ) {
    if (!loc.stackPipeId) {
      throw new EaseyException(
        new Error('Stack Pipe ID is required'),
        HttpStatus.BAD_REQUEST,
      );
    }

    const repository = withTransaction(this.repository, trx);

    const stackPipe = repository.create({
      id: uuid(),
      activeDate: loc.activeDate,
      facId,
      name: loc.stackPipeId,
      retireDate: loc.retireDate,
      userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    return await repository.save(stackPipe);
  }

  async getStackByNameAndFacId(
    nameId: string,
    facilityId: number,
    trx?: EntityManager,
  ): Promise<StackPipe> {
    return withTransaction(this.repository, trx).findOneBy({
      name: nameId,
      facId: facilityId,
    });
  }

  async importStackPipe(
    stackPipe: StackPipeBaseDTO,
    userId: string,
    draft = false,
  ) {
    if (draft) {
      this.logger.debug('Formulating a draft stack pipe record', stackPipe);
    }

    let result = null;

    // Start a transaction.
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const trx = queryRunner.manager;
      // Create the stack pipe record if it doesn't exist, update it if it does.
      const stackPipeRecord =
        (await this.updateStackPipe(
          await this.getStackByNameAndFacId(
            stackPipe.stackPipeId,
            stackPipe.facilityId,
            trx,
          ),
          stackPipe.retireDate,
          userId,
          trx,
        )) ??
        (await this.createStackPipeRecord(
          stackPipe,
          stackPipe.facilityId,
          userId,
          trx,
        ));
      this.logger.debug('stackPipeRecord', stackPipeRecord);

      // Create the accompanying monitor location record if it doesn't exist.
      if (
        !(await (trx ?? this.entityManager).findOneBy(
          MonitorLocationWorkspace,
          {
            stackPipeId: stackPipeRecord.id,
          },
        ))
      ) {
        const locationRecord = await this.monitorLocationWorkspaceService.createMonitorLocationRecord(
          {
            stackPipeId: stackPipeRecord.id,
            userId,
            trx,
          },
        );
        this.logger.debug('locationRecord', locationRecord);
      }

      result = await this.map.one(stackPipeRecord);

      if (draft) {
        // Rollback the transaction if the operation is a draft.
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    this.logger.debug('Import stack pipe result', result);
    return result;
  }

  async runStackPipeChecks(location: UpdateMonitorLocationDTO, facId: number) {
    const errorList: string[] = [];
    // Check if retire date is before active date for any stack/pipes.
    if (
      location.activeDate &&
      location.retireDate &&
      new Date(location.retireDate) < new Date(location.activeDate)
    ) {
      errorList.push(
        'The Retire Date of the Stack/Pipe cannot be before the Active Date',
      );
    }

    if (!location.activeDate) {
      errorList.push('The Stack/Pipe must have an Active Date.');
    }

    const stackPipeRecord = await this.getStackByNameAndFacId(
      location.stackPipeId,
      facId,
    );

    if (
      stackPipeRecord &&
      new Date(stackPipeRecord.activeDate).getTime() !==
        new Date(location.activeDate).getTime()
    ) {
      errorList.push(
        'The Active Date for one or more Stack/Pipe records does not match the official record for this Stack/Pipe. Please contact ECMPS Support if you need to correct the Active Date for any Stack/Pipe records.',
      );
    }

    if (
      stackPipeRecord?.retireDate &&
      new Date(stackPipeRecord.retireDate).getTime() !==
        new Date(location.retireDate).getTime()
    ) {
      errorList.push('Cannot update a retired stack pipe');
    }

    const evaluation = await this.emissionEvaluationService.getLastEmissionEvaluationByStackPipeId(
      location.stackPipeId,
      facId,
    );

    if (evaluation) {
      if (
        stackPipeRecord &&
        !stackPipeRecord.retireDate &&
        location.retireDate &&
        new Date(location.retireDate) <
          new Date(evaluation.reportingPeriod.endDate)
      ) {
        // Check the retire date if the record exists.
        errorList.push(
          'The Retire Date of the Stack/Pipe cannot be before the end date of the last Emission Evaluation for the Stack/Pipe.',
        );
      }
    }

    return errorList;
  }

  async updateStackPipe(
    stackPipeRecord: StackPipe,
    retireDate: Date,
    userId: string,
    trx?: EntityManager,
  ) {
    if (!stackPipeRecord) return null;

    const repository = withTransaction(this.repository, trx);
    if (
      new Date(retireDate).getTime() !==
      new Date(stackPipeRecord.retireDate).getTime()
    ) {
      await repository.update(stackPipeRecord.id, {
        retireDate,
        updateDate: currentDateTime(),
        userId,
      });
      this.logger.debug(`Stack pipe ${stackPipeRecord.name} updated`);
    } else {
      this.logger.debug(`Stack pipe ${stackPipeRecord.name} unchanged`);
    }
    return repository.findOneBy({ id: stackPipeRecord.id });
  }
}
