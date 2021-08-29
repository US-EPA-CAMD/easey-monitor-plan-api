import { Controller } from '@nestjs/common';

import { UnitCapacityWorkspaceService } from './unit-capacity.service';

@Controller()
export class UnitCapacityWorkspaceController {
  constructor(private readonly service: UnitCapacityWorkspaceService) {}
}
