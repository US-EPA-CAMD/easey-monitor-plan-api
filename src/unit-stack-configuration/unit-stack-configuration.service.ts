import { Injectable } from '@nestjs/common';

import { UnitStackConfigurationRepository } from './unit-stack-configuration.repository';

@Injectable()
export class UnitStackConfigurationService {
  constructor(private readonly repository: UnitStackConfigurationRepository) {}
}
