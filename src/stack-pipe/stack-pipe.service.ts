import { Injectable } from '@nestjs/common';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { StackPipeRepository } from './stack-pipe.repository';

@Injectable()
export class StackPipeService {
  constructor(private readonly repository: StackPipeRepository) {}

  async getStackByNameAndFacId(
    nameId: string,
    facilityId: number,
  ): Promise<StackPipe> {
    return this.repository.findOne({
      where: { name: nameId, facId: facilityId },
    });
  }

  async importStackPipe(stackPipeRecord: StackPipe, retireDate: Date) {
    return new Promise(async resolve => {
      await this.repository.update(stackPipeRecord.id, {
        retireDate,
      });
      resolve(true);
    });
  }
}
