import { Controller } from '@nestjs/common';

import { UnitFuelWorkspaceService } from './unit-fuel.service';

@Controller()
export class UnitFuelWorkspaceController {
  constructor(private readonly service: UnitFuelWorkspaceService) {}
}
