import { Controller } from '@nestjs/common';
import { UnitCapacityService } from './unit-capacity.service';

@Controller()
export class UnitCapacityController {
  constructor(private readonly service: UnitCapacityService) {}
}
