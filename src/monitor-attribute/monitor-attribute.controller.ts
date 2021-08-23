import { Controller } from '@nestjs/common';
import { MonitorAttributeService } from './monitor-attribute.service';

@Controller()
export class MonitorAttributeController {
  constructor(
    private readonly monitorAttributeService: MonitorAttributeService,
  ) {}
}
