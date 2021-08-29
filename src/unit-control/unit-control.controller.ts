import { Controller } from '@nestjs/common';

import { UnitControlService } from './unit-control.service';

@Controller()
export class UnitControlController {
  constructor(private readonly service: UnitControlService) {}
}
