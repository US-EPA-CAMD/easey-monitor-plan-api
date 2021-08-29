import { Controller } from '@nestjs/common';
import { UnitControlWorkspaceService } from './unit-control.service';

@Controller()
export class UnitControlWorkspaceController {
  constructor(private readonly service: UnitControlWorkspaceService) {}
}
