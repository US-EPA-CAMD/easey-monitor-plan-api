import { Controller } from '@nestjs/common';
import { MonitorDefaultService } from './monitor-default.service';

@Controller()
export class MonitorDefaultController {
  constructor(private readonly service: MonitorDefaultService) {}
}
