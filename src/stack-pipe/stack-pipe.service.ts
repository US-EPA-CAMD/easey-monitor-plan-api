import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { v4 as uuid } from 'uuid';

import { MonitorLocationBaseDTO } from '../dtos/monitor-location-base.dto';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { StackPipeRepository } from './stack-pipe.repository';

@Injectable()
export class StackPipeService {
  constructor(private readonly repository: StackPipeRepository) {}

  async createStackPipe(
    loc: MonitorLocationBaseDTO,
    facId: number,
    userId: string,
  ) {
    if (!loc.stackPipeId) {
      throw new EaseyException(
        new Error('Stack Pipe ID is required'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const stackPipe = this.repository.create({
      id: uuid(),
      activeDate: loc.activeDate,
      facId,
      name: loc.stackPipeId,
      retireDate: loc.retireDate,
      userId,
      addDate: currentDateTime(),
      updateDate: currentDateTime(),
    });

    return await this.repository.save(stackPipe);
  }

  async getStackByNameAndFacId(
    nameId: string,
    facilityId: number,
  ): Promise<StackPipe> {
    return this.repository.findOneBy({
      name: nameId,
      facId: facilityId,
    });
  }

  async importStackPipe(stackPipeRecord: StackPipe, retireDate: Date) {
    return new Promise(resolve => {
      (async () => {
        await this.repository.update(stackPipeRecord.id, {
          retireDate,
        });
        resolve(true);
      })();
    });
  }
}
