import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { StackPipeDTO } from '../dtos/stack-pipe.dto';
import { StackPipe } from '../entities/stack-pipe.entity';
import { StackPipe as StackPipeWorkspace } from '../entities/workspace/stack-pipe.entity';

@Injectable()
export class StackPipeMap extends BaseMap<
  StackPipe | StackPipeWorkspace,
  StackPipeDTO
> {
  public async one(
    entity: StackPipe | StackPipeWorkspace,
  ): Promise<StackPipeDTO> {
    return {
      id: entity.id,
      activeDate: entity.activeDate,
      facilityId: entity.facId,
      stackPipeId: entity.name,
      retireDate: entity.retireDate,
    };
  }
}
