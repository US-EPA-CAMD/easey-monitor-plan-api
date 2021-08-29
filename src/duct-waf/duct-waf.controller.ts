import { Controller } from '@nestjs/common';

import { DuctWafService } from './duct-waf.service';

@Controller()
export class DuctWafController {
  constructor(private readonly service: DuctWafService) {}
}
