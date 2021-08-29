import { Controller } from '@nestjs/common';

import { UnitStackConfigurationService } from './unit-stack-configuration.service';

@Controller()
export class UnitStackConfigurationController {
  constructor(private readonly service: UnitStackConfigurationService) {}
}
