import { Controller } from '@nestjs/common';

import { UnitFuelService } from './unit-fuel.service';

@Controller()
export class UnitFuelController {
  constructor(private readonly service: UnitFuelService) {}
}
