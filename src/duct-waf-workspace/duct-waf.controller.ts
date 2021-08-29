import { Controller } from '@nestjs/common';

import { DuctWafWorkspaceService } from './duct-waf.service';

@Controller()
export class DuctWafWorkspaceController {
  constructor(private readonly service: DuctWafWorkspaceService) {}
}
