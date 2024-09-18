import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LookupType } from '@us-epa-camd/easey-common/enums';

import { StackPipeBaseDTO, StackPipeDTO } from '../dtos/stack-pipe.dto';
import { StackPipeWorkspaceService } from './stack-pipe.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Stacks & Pipes')
export class StackPipeWorkspaceController {
  constructor(private readonly service: StackPipeWorkspaceService) {}

  @Post('import')
  @ApiOkResponse({
    type: StackPipeDTO,
    description: 'Imports a stack pipe record from a JSON payload.',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      bodyParam: 'facilityId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  importStackPipe(
    @Query('draft') draft: boolean,
    @Body() stackPipe: StackPipeBaseDTO,
    @User() user: CurrentUser,
  ) {
    return this.service.importStackPipe(stackPipe, user.userId, draft);
  }
}
