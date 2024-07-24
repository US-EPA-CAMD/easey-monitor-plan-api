import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CancelTransactionException,
  EaseyException,
} from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { v4 as uuid } from 'uuid';

import { MonitorLocationBaseDTO } from '../dtos/monitor-location-base.dto';
import { StackPipeBaseDTO } from '../dtos/stack-pipe.dto';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { StackPipeMap } from '../maps/stack-pipe.map';
import { withTransaction } from '../utils';
import { StackPipeWorkspaceRepository } from './stack-pipe.repository';
import { MonitorLocation as MonitorLocationWorkspace } from '../entities/workspace/monitor-location.entity';
import { MonitorLocationWorkspaceService } from '../monitor-location-workspace/monitor-location.service';

@Injectable()
export class StackPipeWorkspaceService {
  constructor(
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

    try {
      await this.entityManager.transaction(async trx => {
        // Create the stack pipe record if it doesn't exist, update it if it does.
        const stackPipeRecord =
          (await this.updateStackPipe(
            await this.getStackByNameAndFacId(
              stackPipe.stackPipeId,
              stackPipe.facilityId,
              trx,
            ),
            stackPipe.retireDate,
            trx,
          )) ??
          (await this.createStackPipeRecord(
            stackPipe,
            stackPipe.facilityId,
            userId,
            trx,
          ));

        // Create the accompanying monitor location record if it doesn't exist.
        if (
          !(await (trx ?? this.entityManager).findOneBy(
            MonitorLocationWorkspace,
            {
              stackPipeId: stackPipeRecord.id,
            },
          ))
        ) {
          await this.monitorLocationWorkspaceService.createMonitorLocationRecord(
            {
              stackPipeId: stackPipeRecord.id,
              userId,
              trx,
            },
          );
        }

        result = this.map.one(stackPipeRecord);

        if (draft) {
          throw new CancelTransactionException();
        }
      });
    } catch (err) {
      if (!(err instanceof CancelTransactionException)) {
        throw err;
      }
    }
    this.logger.debug('Import stack pipe result', result);
    return result;
  }

  async updateStackPipe(
    stackPipeRecord: StackPipe,
    retireDate: Date,
    trx?: EntityManager,
  ) {
    if (!stackPipeRecord) return null;

    const repository = withTransaction(this.repository, trx);
    await repository.update(stackPipeRecord.id, {
      retireDate,
    });
    return repository.findOneBy({ id: stackPipeRecord.id });
  }
}
