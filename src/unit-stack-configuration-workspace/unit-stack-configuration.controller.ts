import { Controller } from '@nestjs/common';

import { UnitStackConfigurationWorkspaceService } from './unit-stack-configuration.service';

@Controller()
export class UnitStackConfigurationWorkspaceController {
  constructor(
    private readonly service: UnitStackConfigurationWorkspaceService,
  ) {}
}
