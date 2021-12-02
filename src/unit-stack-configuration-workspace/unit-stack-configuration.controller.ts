import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';

@ApiTags('Unit and Stack Configurations')
@Controller()
export class UnitStackConfigurationWorkspaceController {
  constructor(
    private readonly service: UnitStackConfigurationWorkspaceService,
  ) {}
}
