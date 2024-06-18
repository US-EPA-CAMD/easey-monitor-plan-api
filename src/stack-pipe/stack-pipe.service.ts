import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MonitorLocationBaseDTO } from '../dtos/monitor-location-base.dto';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { StackPipeRepository } from './stack-pipe.repository';

@Injectable()
export class StackPipeService {
  constructor(private readonly repository: StackPipeRepository) {}

  async createStackPipeRecord(
    loc: MonitorLocationBaseDTO,
    facId: number,
    userId: string,
    trx?: EntityManager,
  ) {
    if (!loc.stackPipeId) {
      throw new EaseyException(
        new Error('Stack Pipe ID is required'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const repository = trx?.withRepository(this.repository) ?? this.repository;

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
    return (trx?.withRepository(this.repository) ?? this.repository).findOneBy({
      name: nameId,
      facId: facilityId,
    });
  }

  async importStackPipe(
    stackPipeRecord: StackPipe,
    retireDate: Date,
    trx?: EntityManager,
  ) {
    return new Promise(resolve => {
      (async () => {
        await (trx?.withRepository(this.repository) ?? this.repository).update(
          stackPipeRecord.id,
          {
            retireDate,
          },
        );
        resolve(true);
      })();
    });
  }
}
